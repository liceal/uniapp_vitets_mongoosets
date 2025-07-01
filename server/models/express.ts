import { MySchema } from "#/utils/mySchema";
import type { SchemaTimestampsConfig } from "mongoose";
import mongoose from "mongoose";
import type { ExpressLogTypes, ExpressTypes, OrderTypes } from "types/server";
import { orderSchema } from "./order";

// 状态字典常量
export const EXPRESS_STATUS_DICT = {
  1: "订单已确认",
  10: "已下单",
  20: "已发货",
  30: "运输中",
  40: "派送中",
  50: "待取件",
  60: "已签收",
} as const;

// 物流日志
export type ExpressLogDocument = mongoose.Document & ExpressLogTypes;
const expressLogSchema = new MySchema<ExpressLogDocument>({
  status: {
    type: Number,
    enum: [1, 10, 20, 30, 40, 50], // 物流状态枚举值：1-订单已确认 10-已下单 20-已发货 30-运输中 40-派送中 50-已签收
    default: 1, // 默认状态为"订单已确认"
    required: true,
  },
  location: {
    type: String,
  },
  remark: {
    type: String,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

expressLogSchema.virtual("status_name").get(function () {
  return EXPRESS_STATUS_DICT[this.status] || "未知状态";
});

export type ExpressDocument = mongoose.Document &
  SchemaTimestampsConfig &
  ExpressTypes;
export const expressSchema = new MySchema<ExpressDocument>({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orders",
    required: true,
  },
  status: {
    type: Number,
    enum: [1, 10, 20, 30, 40, 50], // 物流状态枚举值：1-订单已确认 10-已下单 20-已发货 30-运输中 40-派送中 50-已签收
    default: 1, // 默认状态为"订单已确认"
  },
  status_name: {
    type: String,
    enum: [
      "订单已确认",
      "已下单",
      "已发货",
      "运输中",
      "派送中",
      "待取件",
      "已签收",
    ],
    default: "订单已确认",
  },
  pickup_code: {
    //取件码
    type: String,
    default: "",
  },
  collect: {
    //取件点
    type: String,
    default: "",
  },
  address: {
    //取件地址
    type: String,
    default: "",
  },
  courier: {
    //取件人
    type: String,
    default: "",
  },
  courier_phone: {
    //取件人电话
    type: String,
    default: "",
  },
  express_code: {
    // 快递单号
    type: String,
    default: "",
  },
  express_name: {
    // 快递公司
    type: String,
    default: "",
  },
  receive_addr: {
    // 实际收货地址
    type: String,
    required: true,
  },
  express_logs: {
    //日志
    type: [expressLogSchema],
    default: () => [],
  } as mongoose.SchemaDefinitionProperty<ExpressLogTypes[]>, //重新定义类型为模型中的类型
});

export const Expresses = mongoose.model<ExpressDocument>(
  "Expresses",
  expressSchema
);
