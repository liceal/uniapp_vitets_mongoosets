import { Captcha } from "#/models/captcha";
import type { Request, Response } from "express";

// 创建验证码
const createCaptcha = async (req: Request, res: Response) => {
  try {
    // 创建验证码
    // const captcha = svgCaptcha.create();
    // // 保存验证码到数据库
    const newCaptcha = new Captcha();

    const captcha = await newCaptcha.newCaptcha();

    res.status(201).json({
      message: "验证码",
      data: {
        id: captcha._id,
        svg: captcha.svg,
      },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// 获取验证码列表
const captchaList = async (req: Request, res: Response) => {
  try {
    const captchas = await Captcha.find();
    res.status(200).json({ message: "验证码列表", data: captchas });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: "验证码列表查询失败" });
  }
};

// 验证验证码
export type verifyCaptchaTypes = {
  id: string; // 验证码的唯一码，用于验证
  code: string; // 验证码的文本
};
const verifyCaptcha = async (req: Request, res: Response) => {
  try {
    const { id, code } = req.body as verifyCaptchaTypes;
    const captcha = await Captcha.findById(id);
    if (!captcha) {
      res.status(400).json({ message: "验证码不存在" }); // 验证码不存在
      return;
    }
    if (captcha.code !== code) {
      res.status(400).json({ message: "验证码错误" }); // 验证码错误
      return;
    }
    // 验证成功 验证码删除
    // await captcha.deleteOne();
    res.status(200).json({ message: "验证码验证成功" });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: "验证码验证失败" });
  }
};

export default { createCaptcha, captchaList, verifyCaptcha };
