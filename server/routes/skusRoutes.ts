import { Goods } from "#/models/goods";
import { SkuGroups, Skus } from "#/models/skus";
import { generateRoutes } from "#/utils/crudFactory";
import { Request, Response, Router } from "express";
import type { skuCreateTypes } from "types/server";

const router = Router();

generateRoutes(router, Skus, {
  postList: {
    $pipeline: [
      {
        $unwind: "$sku_groups_ids", // 拆分 sku_groups_ids 数组，为每个 ID 创建一个文档
      },
      {
        $lookup: {
          from: "skugroups", // 要连接的集合
          localField: "sku_groups_ids", // products 集合中要匹配的字段
          foreignField: "_id", // sku_groups 集合中要匹配的字段 (通常是 _id)
          as: "sku_groups_detail", // 连接结果的输出字段名
        },
      },
      {
        $unwind: "$sku_groups_detail", // 拆分 sku_groups_detail 数组，如果匹配到一个 sku_group
      },
      {
        $group: {
          _id: "$_id", // 按原始文档的 _id 分组，将 sku_groups_detail 收集起来
          // goods_id:"$goods_id",
          // 其他字段，根据您的需求添加，例如：
          goods_id: { $first: "$goods_id" },
          sku_groups_ids: { $first: "$sku_groups_ids" },
          sku_groups: { $push: "$sku_groups_detail" }, // 将匹配到的 sku_groups 详情收集成数组
        },
      },
    ],
  },
});

// 创建skus 自动创建组
router.post("/create", async (req: Request, res: Response) => {
  const body = req.body as skuCreateTypes;
  const { goods_id, sku_groups } = body;
  if (!goods_id) {
    res.status(400).json({ message: "商品id不能为空" });
    return;
  }
  const goods = await Goods.findById(goods_id);
  if (!goods) {
    res.status(400).json({ message: `${goods_id} 商品没找到` });
    return;
  }

  // 开启事务
  const session = await Skus.startSession();
  try {
    await session.withTransaction(async () => {
      // 创建sku组
      const skuGroups = await SkuGroups.insertMany(sku_groups, { session });
      console.log(`${skuGroups.length} 个sku组创建了`);

      // 创建sku 绑定商品
      const newSku = new Skus({
        goods_id: goods_id,
        sku_groups_ids: skuGroups.map((v) => v.id),
      });
      const sku = await newSku.save({ session });

      const doc = {
        id: sku.id,
        sku_groups: skuGroups,
      };

      res.status(200).json(doc);
    });
  } catch (err: any) {
    console.log("创建sku和sku组出错：", err);
    res.status(500).json(err);
  }
});

export const skusRoutes = router;
