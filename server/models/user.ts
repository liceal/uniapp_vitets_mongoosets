import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import type { UserTypes } from "types/server";

type UserMethodsTypes = {
  generateAuthToken: () => string;
};

type UserDocument = mongoose.Document & UserTypes & UserMethodsTypes;

const userSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, required: true },
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

export const User = mongoose.model<UserDocument>("User", userSchema);
