import { MySchema } from "#/utils/mySchema";
import mongoose, { type SchemaTimestampsConfig } from "mongoose";
import type { SkuTypes } from "types/sku";

// 唯一规格的内容 用于选择规格后返回规格对应价格库存等
type SkuDocument = mongoose.Document & SkuTypes & SchemaTimestampsConfig;
const skuSchema = new MySchema<SkuDocument>({
  goods_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "goods",
    required: true,
  },
  attr: {
    //规格属性 例如{颜色:红色,...}
    type: Map,
    of: String,
  },
  image: String,
  price: Number,
  stock: Number,
});

export const Skus = mongoose.model<SkuDocument>("Skus", skuSchema);
