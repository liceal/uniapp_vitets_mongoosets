import moment from "moment";
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
    updatedAt: {
      type: Date,
      get: (date: string) => {
        if (date) {
          return moment(date).format("YYYY-MM-DD HH:mm:ss");
        }
      },
    },
    createdAt: {
      type: Date,
      get: (date: string) => {
        if (date) {
          return moment(date).format("YYYY-MM-DD HH:mm:ss");
        }
      },
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

export const Shop = mongoose.model<ShopDocument>("shops", shopSchema);
