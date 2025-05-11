/*
  商品表
*/

import mongoose from "mongoose";

export type GoodsTypes = {
  name: string; //商品名称
  price: number; //商品价格
  pictureUrl: string; //商品图片
  shopId: string; //商品所属店铺
};

type GoodsDocument = mongoose.Document & GoodsTypes;

const goodsSchema = new mongoose.Schema<GoodsDocument>({
  // 商品信息
  name: { type: String, required: true }, //商品名称
  price: { type: Number, required: true }, //商品价格
  pictureUrl: { type: String, required: true }, //商品图片
});

export const Goods = mongoose.model<GoodsDocument>("Goods", goodsSchema);
