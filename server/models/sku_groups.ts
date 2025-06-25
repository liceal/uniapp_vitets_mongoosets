import { MySchema } from "#/utils/mySchema";
import type { SchemaTimestampsConfig } from "mongoose";
import mongoose from "mongoose";
import type { SkuGroupTypes } from "types/sku";

type SkuGroupDocument = mongoose.Document &
  SkuGroupTypes &
  SchemaTimestampsConfig;

// 商品属性
const SkuGroupSchema = new MySchema<SkuGroupDocument>({
  name: {
    type: String,
    required: true,
  },
  values: {
    type: [
      {
        image: String,
        name: String,
        is_avaliable: {
          type: Boolean,
          default: true,
        },
        is_fire: {
          type: Boolean,
          default: false,
        },
      },
    ],
    required: true,
  },
});
export const SkuGroups = mongoose.model<SkuGroupDocument>(
  "SkuGroups",
  SkuGroupSchema
);
