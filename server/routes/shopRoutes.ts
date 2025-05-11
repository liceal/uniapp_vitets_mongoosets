import { Router } from "express";
import ShopControlles from "@server/controllers/shop";
import { generateRoutes } from "@server/utils/crudFactory";
import { Shop } from "@server/models/shop";

const router = Router();

// router.post("/", ShopControlles.createShop);
// router.get("/", ShopControlles.getAllShops);
// router.get("/:id", ShopControlles.getShopById);
// router.delete("/:id", ShopControlles.deleteShop);
// router.put("/:id", ShopControlles.updateShop);

// 封装curd 实现上面5个
const curdRouter = generateRoutes(router, Shop, {
  // getAll: {
  //   query: (req) => {
  //     const query = req.query as ShopTypes;
  //     return {
  //       name: { $regex: query.name || "", $options: "i" },
  //     };
  //   },
  // },
  async getAll(req) {
    let data = await Shop.find({
      name: { $regex: req.query.name || "", $options: "i" },
    });
    return data;
  },
});

export default router;
