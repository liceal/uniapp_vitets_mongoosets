import { MySchema } from "#/utils/mySchema";
import mongoose, { SchemaTimestampsConfig } from "mongoose";
import type { skuGroupTypes, skusTypes } from "types/server";

type SkuDocuments = mongoose.Document & skusTypes & SchemaTimestampsConfig;

const skusSchema = new MySchema<SkuDocuments>({
  goods_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "goods",
    required: true,
    index: true,
  },
  sku_groups_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "skuGroups",
    required: true,
  },
});

type SkuGroupDocument = mongoose.Document &
  skuGroupTypes &
  SchemaTimestampsConfig;
const skuGroupSchema = new MySchema<SkuGroupDocument>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    default: 1,
  },
  values: {
    type: [
      {
        img: { type: String, required: false },
        text: { type: String, required: true },
        is_fire: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
      },
    ],
    required: true,
  },
});

export const Skus = mongoose.model<SkuDocuments>("Skus", skusSchema);
export const SkuGroups = mongoose.model<SkuGroupDocument>(
  "SkuGroups",
  skuGroupSchema
);
