import mongoose, { SchemaTimestampsConfig } from "mongoose";

type ShopTypes = {
  name: string; //店铺名字
  pictureUrl: string; //店铺图片
};
type ShopDocument = mongoose.Document & ShopTypes & SchemaTimestampsConfig;

const shopSchema = new mongoose.Schema<ShopDocument>(
  {
    name: { type: String, required: true },
    pictureUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Shop = mongoose.model<ShopDocument>("shops", shopSchema);
