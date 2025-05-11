import { Router } from "express";
import ShopControlles from "@server/controllers/shop";

const router = Router();

router.post("/", ShopControlles.createShop);
router.get("/", ShopControlles.getAllShops);
router.get("/:id", ShopControlles.getShopById);
router.delete("/:id", ShopControlles.deleteShop);
router.put("/:id", ShopControlles.updateShop);

export default router;
