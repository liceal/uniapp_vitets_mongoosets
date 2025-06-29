import { MySchema } from "#/utils/mySchema";
import mongoose, { Query, type SchemaTimestampsConfig } from "mongoose";
import type { AddressesTypes } from "types/server";

export type AddressesDocument = mongoose.Document &
  SchemaTimestampsConfig &
  AddressesTypes;
export const addressesSchema = new MySchema<AddressesDocument>({
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  is_default: {
    type: Boolean,
    default: false,
  },
  is_top: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
});

addressesSchema.virtual("address_full").get(function () {
  return `${this.province} ${this.city} ${this.area} ${this.address}`;
});

addressesSchema.pre(/^find/, function (this: Query<any, any>, next) {
  this.sort({ is_top: -1, order: -1, createdAt: -1 });
  next();
});

export const Addresses = mongoose.model<AddressesDocument>(
  "Addresses",
  addressesSchema
);
