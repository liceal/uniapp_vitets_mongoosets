import { Router, type Request, type Response } from "express";
import { generateRoutes } from "#/utils/crudFactory";
import { Goods } from "#/models/goods";
import type { GoodsAttrsTypes } from "types/server";
import mongoose from "mongoose";
import { SkuGroups } from "#/models/sku_groups";
import { Skus } from "#/models/skus";

const router = Router();

router.get("/getIndexes", async (req, res) => {
  const indexes = await Goods.collection.getIndexes();
  res.json(indexes);
});

// 封装curd 实现上面5个
generateRoutes(router, Goods, {
  getOne(req) {
    return (
      Goods.findById(req.params.id)
        // .populate({
        //   path: "shopId",
        //   select: "_id name pictureUrl",
        // })
        .populate({
          path: "shopDetail",
          select: "-__v",
        })
    );
  },
  postList: {
    $lookup: {
      from: "shops",
      localField: "shopId",
      foreignField: "_id",
      as: "shopDetail",
    },
    $addFields: {
      sales_str: {
        $concat: [
          "$name",
          { $literal: "只要" },
          { $toString: "$price" },
          { $literal: "元~" },
        ],
      },
    },
  },
});

// 对商品创建规格属性
router.post("/create_attrs", async (req: Request, res: Response) => {
  const body = req.body as GoodsAttrsTypes;
  const { goods_id, attrs, skus } = body;
  // 开启事务 新增商品规格

  // 检查商品是否存在
  const goods = await Goods.findById(goods_id);
  if (!goods) {
    res.status(400).json({ message: "商品未找到" });
    return;
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // 删除老的商品规格组
      if (goods.sku_group_ids.length) {
        await SkuGroups.deleteMany(
          {
            _id: { $in: goods.sku_group_ids },
          },
          { session }
        );
      }

      // 删除这个商品老的唯一规格配置
      await Skus.deleteMany(
        {
          goods_id: goods._id,
        },
        { session }
      );

      // 插入新的规格组
      const createdGroups = await SkuGroups.insertMany(
        attrs.map(
          (attr) => ({
            name: attr.name,
            values: attr.values,
          }),
          { session }
        )
      );

      // 设置唯一规格的值
      await Skus.insertMany(
        skus.map(
          (sku) => ({
            goods_id: goods._id,
            attr: sku.attr,
            image: sku.image,
            price: sku.price,
            stock: sku.stock,
          }),
          { session }
        )
      );

      // 更新商品的规格组ID
      await goods.updateOne(
        { $set: { sku_group_ids: createdGroups.map((v) => v._id) } },
        { session }
      );

      res.status(200).json({ message: "规格属性设置成功", data: goods });
      return;
    });
  } catch (err: any) {
    console.log("设置商品规格属性出错：", err);
    res.status(500).json({ message: err });
  }
});

// 获取商品的属性规格组
router.post("/attrs", async (req: Request, res: Response) => {
  const { goods_id } = req.body;
  const goods = await Goods.findById(goods_id)
    .select("sku_group_ids")
    .populate("sku_group_ids");

  // 查找这个商品使用的唯一规格属性
  const skus = await Skus.find({ goods_id: goods_id });

  const doc = {
    goods_id,
    attrs: goods?.sku_group_ids || [],
    skus,
  };

  res.status(200).json(doc);
});

export const goodsRoutes = router;
