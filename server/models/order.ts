import { MySchema } from "#/utils/mySchema";
import mongoose, { type SchemaTimestampsConfig } from "mongoose";
import type { OrderTypes } from "types/server";
import { addressesSchema } from "./addresses";

type OrderDocument = mongoose.Document & OrderTypes & SchemaTimestampsConfig;

const orderSchema = new MySchema<OrderDocument>({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shops",
  },
  goodsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "goods",
  },
  shopName: { type: String, required: true },
  shopImgUrl: { type: String, required: true },
  goodsName: { type: String, required: true },
  goodsSkuStr: { type: String, required: true },
  goodsUnitPrice: { type: Number, required: true },
  goodsNumber: {
    type: Number,
    required: true,
    set: (v: number) => parseFloat(v.toFixed(2)), // 自动保留2位小数
  },
  goodsTotalPrice: { type: Number, required: true },
  goodsImgUrl: { type: String, required: true },
  status: {
    type: Number,
    required: true,
    enum: [10, 20, 30, 40, 50],
    default: 10,
  },
  shippingFee: { type: Boolean, default: true },
  noReason7d: { type: Boolean, default: true },
  useFirst: { type: Boolean, default: true },
  address: {
    type: addressesSchema,
    required: true,
  },
});

// 定义虚拟字段 查询详情
orderSchema.virtual("shopDetail", {
  ref: "shops",
  localField: "shopId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.virtual("goodsDetail", {
  ref: "goods",
  localField: "goodsId",
  foreignField: "_id",
  justOne: true,
});

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);
