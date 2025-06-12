import { Goods } from "#/models/goods";
import { Order } from "#/models/order";
import { generateRoutes } from "#/utils/crudFactory";
import { Request, Router } from "express";
import type { OrderTypes } from "types/server";

const router = Router();

async function createOrder(req: Request): Promise<Object | null> {
  try {
    const { goodsId, number } = req.body;

    const goods = await Goods.findById(goodsId).populate({
      path: "shopDetail",
      select: "-__v",
    });

    if (!goods) {
      throw new Error("商品不存在");
    }
    if (!goods.shopDetail) {
      throw new Error("店铺不存在");
    }

    const newOrder: Partial<OrderTypes> = {
      goodsId: goods.id,
      shopId: goods.shopDetail.id,
      shopName: goods.shopDetail.name,
      shopImgUrl: goods.shopDetail.pictureUrl,
      goodsName: goods.name,
      goodsSkuStr: "自定义的sku字符串自定义的sku字符串自定义的sku字符串",
      goodsUnitPrice: goods.price,
      goodsNumber: number,
      goodsTotalPrice: goods.price * number,
      goodsImgUrl: goods.pictureUrl,
    };

    return Order.create(newOrder);
  } catch (error) {
    console.log(error);

    throw error;
  }
}

const curdRouter = generateRoutes(router, Order, {
  createOne: createOrder,
  postList: {
    $match: (req) => {
      let { status } = req.body;
      if (!status || status === -1) {
        return {};
      }
      return {
        status,
      };
    },
    $addFields: {
      statusName: {
        $switch: {
          branches: [
            { case: { $eq: ["$status", 10] }, then: "待付款" },
            { case: { $eq: ["$status", 20] }, then: "拼团中" },
            { case: { $eq: ["$status", 30] }, then: "打包中" },
            { case: { $eq: ["$status", 40] }, then: "待收货" },
            { case: { $eq: ["$status", 40] }, then: "已完成" },
          ],
          default: "未知状态",
        },
      },
    },
  },
});

export const orderRoutes = curdRouter;
