import mongoose, { type SchemaTimestampsConfig } from "mongoose";
import jwt from "jsonwebtoken";
import type { UserTypes } from "types/server";

type UserMethodsTypes = {
  generateAuthToken: () => string;
};

export type UserDocument = mongoose.Document &
  SchemaTimestampsConfig &
  UserTypes &
  UserMethodsTypes;

const userSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  email: { type: String, required: true, unique: true },
  avatar: {
    type: String,
    required: true,
    default:
      "https://img-3.pddpic.com/garner-api-new/8b60a95aca982f998eba3ff449d600a1.jpeg?imageView2/2/w/1300/q/80",
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shops", //这里关联了shops表 用populate("shopId")可以查询到shopId对应的店铺信息
    index: true,
  },
});

// 生成token方法
export type jwtMsg = {
  userId: string;
};
userSchema.methods.generateAuthToken = function (this: UserDocument) {
  // 使用jwt生成

  const token = jwt.sign(
    { userId: this._id } as jwtMsg,
    process.env.JWT_SECRET!,
    {
      expiresIn: "30d",
    }
  );

  return token;
};

export const User = mongoose.model<UserDocument>("users", userSchema);
