import moment from "moment";
import mongoose, { type SchemaTimestampsConfig } from "mongoose";
import type { ShopTypes } from "types/server";

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
    versionKey: false,
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
    id: true,
  }
);

export const Shop = mongoose.model<ShopDocument>("shops", shopSchema);
