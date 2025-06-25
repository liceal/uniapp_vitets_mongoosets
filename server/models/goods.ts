/*
  商品表
*/

import { MySchema } from "#/utils/mySchema";
import moment from "moment";
import mongoose, { type SchemaTimestampsConfig } from "mongoose";
import type { GoodsTypes } from "types/server";

type GoodsDocument = mongoose.Document & GoodsTypes & SchemaTimestampsConfig;

const goodsSchema = new MySchema<GoodsDocument>(
  {
    // 商品信息
    name: { type: String, required: true }, //商品名称
    price: { type: Number, required: true }, //商品价格
    pictureUrl: { type: String, required: true }, //商品图片
    price_type: { type: Number, default: 0 }, //0无 1券后
    sales_type: { type: Number, default: 0 }, //0无 1总售
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops", //这里关联了shops表 用populate("shopId")可以查询到shopId对应的店铺信息
      required: true,
      index: true,
    },
    shippingFee: { type: Boolean, default: true },
    noReason7d: { type: Boolean, default: true },
    useFirst: { type: Boolean, default: true },
    sku_group_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "SkuGroups",
      default: [],
    },
  },
  {
    softDelete: true,
    // 确保虚拟字段在转换为 JSON 或对象时被包含
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 定义虚拟字段 查询详情
goodsSchema.virtual("shopDetail", {
  ref: "shops",
  localField: "shopId",
  foreignField: "_id",
  justOne: true,
});

goodsSchema.virtual("sales_str").get(function (this: GoodsTypes) {
  return `${this.name}只要${this.price}元~`;
});

export const Goods = mongoose.model<GoodsDocument>("Goods", goodsSchema);
