/*
  二维码的模型
*/

import mongoose from "mongoose";
import svgCaptcha from "svg-captcha";

export type CaptchaTypes = {
  code: string; // 验证码
  svg: string; // svg图片
  expireAt: Date; // 过期时间
};

type CaptchaMethods = {
  newCaptcha: () => Promise<CaptchaDocument>; // 创建验证码
};

export type CaptchaDocument = mongoose.Document & CaptchaTypes & CaptchaMethods;

const captchaSchema = new mongoose.Schema<CaptchaDocument>({
  code: { type: String, required: true }, // 验证码
  svg: { type: String, required: true }, //验证码
  expireAt: { type: Date, default: Date.now, index: { expires: "8h" } }, // 过期时间，5分钟后自动删除
});

// 创建二维码
captchaSchema.methods.newCaptcha = async function (
  this: CaptchaDocument
): Promise<CaptchaDocument> {
  const captcha = svgCaptcha.create(); // 创建验证码
  this.code = captcha.text; // 保存验证码到数据库
  this.svg = captcha.data; // 保存验证码到数据库
  return this.save();
};

export const Captcha = mongoose.model<CaptchaDocument>(
  "captchas",
  captchaSchema
);
