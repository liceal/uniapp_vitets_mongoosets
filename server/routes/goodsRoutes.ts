import { Router } from "express";
import { generateRoutes } from "#/utils/crudFactory";
import { Goods } from "#/models/goods";

const router = Router();

router.get("/getIndexes", async (req, res) => {
  const indexes = await Goods.collection.getIndexes();
  res.json(indexes);
});

// 封装curd 实现上面5个
const curdRouter = generateRoutes(router, Goods, {
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

export const goodsRoutes = curdRouter;
