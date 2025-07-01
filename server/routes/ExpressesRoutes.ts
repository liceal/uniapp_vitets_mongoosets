import { Expresses } from "#/models/express";
import { Order } from "#/models/order";
import { generateRoutes } from "#/utils/crudFactory";
import { Router, type Request, type Response } from "express";
import moment from "moment";
import mongoose from "mongoose";
import type { ExpressLogReqTypes } from "types/server";

const router = Router();

generateRoutes(router, Expresses, {
  async createOne(req) {
    // 创建物流单 再给订单更新物流单

    const order = await Order.findById(req.body.order_id);
    if (!order) {
      return {
        message: "订单不存在",
      };
    }

    // 创建订单
    const express = await Expresses.create({
      ...req.body,
      receive_addr: order.address.address_full,
    });
    // 更新订单
    order.expressId = express._id;
    await order.save();

    return express;
  },
});

router.post("/add_log", async (req: Request, res: Response) => {
  const { id, status, location, remark } = req.body as ExpressLogReqTypes;
  const express = await Expresses.findById(id);
  if (!express) {
    res.status(404).json({ message: "物流单不存在" });
    return;
  }

  express.express_logs.push({
    status: status,
    location: location,
    remark: remark,
    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  });
  const doc = await express.save();
  res.status(200).json(doc.toObject({ virtuals: true }));
});

export const expressesRouter = router;
