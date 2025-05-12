/*
  商品表
*/

import { MySchema } from "@server/utils/mySchema";
import moment from "moment";
import mongoose, { SchemaTimestampsConfig } from "mongoose";

export type GoodsTypes = {
  name: string; //商品名称
  price: number; //商品价格
  pictureUrl: string; //商品图片
  shopId: mongoose.Schema.Types.ObjectId; //商品所属店铺
  createdAt: string; //创建时间
  updatedAt: string; //更新时间
};

type GoodsDocument = mongoose.Document & GoodsTypes & SchemaTimestampsConfig;

const goodsSchema = new MySchema<GoodsDocument>(
  {
    // 商品信息
    name: { type: String, required: true }, //商品名称
    price: { type: Number, required: true }, //商品价格
    pictureUrl: { type: String, required: true }, //商品图片
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops", //这里关联了shops表 用populate("shopId")可以查询到shopId对应的店铺信息
      required: true,
      index: true,
    },
  },
  {
    softDelete: true,
  }
);

export const Goods = mongoose.model<GoodsDocument>("Goods", goodsSchema);
