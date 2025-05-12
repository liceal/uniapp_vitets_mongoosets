import { Router } from "express";
import { generateRoutes } from "@server/utils/crudFactory";
import { Goods } from "@server/models/goods";

const router = Router();

router.get("/getIndexes", async (req, res) => {
  const indexes = await Goods.collection.getIndexes();
  res.json(indexes);
});

// 封装curd 实现上面5个
const curdRouter = generateRoutes(router, Goods, {
  getOne(req) {
    return Goods.findById(req.params.id).populate(
      "shopId",
      "_id name pictureUrl"
    );
  },
});

export const goodsRoutes = curdRouter;
