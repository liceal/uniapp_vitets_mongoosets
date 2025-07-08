import type { NextFunction, Request, Response } from "express";
import { type jwtMsg, User, type UserDocument } from "../models/user";
import svgCaptcha from "svg-captcha";
import NodeCache from "node-cache";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type {
  CaptchaReqTypes,
  CaptchaResTypes,
  UserCreateReqTypes,
  UserLoginReqTypes,
  UserLoginResTypes,
} from "types/server";

const create = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// 登录
const login = async (req: Request, res: Response) => {
  try {
    // res.status(200).json({ message: "登录成功" });
    const { username, password, captchaKey, captchaText } =
      req.body as UserLoginReqTypes;

    // // 验证验证码是否正确
    // const captche = await Captcha.findById(captchaKey); // 从数据库中获取验证码
    // if (!captche) {
    //   res.status(400).json({ message: "验证码已过期" }); // 验证码过期
    //   return;
    // }
    // if (captche.code !== captchaText) {
    //   // 验证码错误
    //   res.status(400).json({ message: "验证码错误" }); // 验证码错误
    //   return;
    // }

    // 验证用户名和密码是否正确
    const user = await User.findOne({ username, password }); // 查找用户
    if (!user) {
      res.status(400).json({ message: "用户名或密码错误" }); // 用户不存在或密码错误
      return;
    }

    // 验证成功 验证码删除
    captchaCache.del(captchaKey);

    // 生成token
    const token = user.generateAuthToken(); // 生成token
    res.setHeader("Authorization", `${token}`); // 设置响应头

    // 登录成功，返回用户信息
    res.status(200).json({
      message: "登录成功",
      data: user,
      token,
    } as UserLoginResTypes);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// 获取验证码 用缓存的方式
// 初始化缓存实例，设置验证码 5 分钟过期
type catpchaCacheData = {
  captchaText: string; // 验证码的文本
  expireAt: number; // 过期时间，5分钟后自动删除
  captchaSvg: string; // 验证码的图片
};
const captchaCache = new NodeCache({ stdTTL: 5 * 60 });
const captcha_cache = async (req: Request, res: Response) => {
  try {
    const captcha = svgCaptcha.create();

    // 生成验证码的唯一码，用于验证
    const captchaKey = Date.now().toString();

    // 验证码存在缓存里面
    captchaCache.set(captchaKey, {
      captchaText: captcha.text, // 验证码的文本
      expireAt: Date.now() + 5 * 60 * 1000, // 过期时间，5分钟后自动删除
      captchaSvg: captcha.data, // 验证码的图片
    } as catpchaCacheData);

    // 设置响应头
    // res.setHeader("Content-Type", "image/svg+xml");
    const encoded = Buffer.from(
      unescape(encodeURIComponent(captcha.data)),
      "binary"
    ).toString("base64");
    const captchaBase64 = `data:image/svg+xml;base64,${encoded}`;
    console.log();
    res.status(200).json({
      captchaKey, // 验证码的唯一码，用于验证
      // captchaSvg: captcha.data, // 验证码的图片
      captchaBase64,
    } as CaptchaResTypes);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "获取验证码失败" });
  }
};

const captchaList_chache = async (req: Request, res: Response) => {
  try {
    const captchaList = captchaCache.keys().map((key) => {
      captchaCache.get(key);
      return {
        key: key,
        data: captchaCache.get(key),
      };
    });
    res.status(200).json(captchaList); // 返回验证码的唯一码列表
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "获取验证码列表失败" });
  }
};

// token校验用户 并且给头上放用户信息
export const userCache = new NodeCache({ stdTTL: 300 }); //缓存5分钟

// 根据token获取用户信息，优先从缓存里面取
export async function getUserInfo(token: string): Promise<UserDocument | null> {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload &
    jwtMsg;
  console.log("jwt解析内容", decoded);
  if (decoded.userId) {
    // 先去缓存里找
    const cachedUser = userCache.get(decoded.userId) as UserDocument;
    if (cachedUser) {
      console.log("返回缓存用户");

      return cachedUser;
    } else {
      const user = await User.findById(decoded.userId);
      if (user) {
        console.log("返回查找的用户并且缓存");
        userCache.set(decoded.userId, user);
        return user;
      } else {
        return null;
      }
    }
  }
  return null;
}

export const login_validator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ message: "未提供token，请先登录" });
      return;
    }

    const user = await getUserInfo(token);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "token找不到用户" });
    }
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "token已过期，请重写登录" });
      return;
    }
    res.status(401).json({ message: "token校验失败" });
    return;
  }
};

export const captcha_validator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body as CaptchaReqTypes;
  // 验证验证码是否正确 验证缓存的
  console.log(captchaCache.keys());

  const captcha = captchaCache.get<catpchaCacheData>(body.captchaKey); // 从缓存中获取验证码
  if (!captcha) {
    res.status(400).json({ message: "验证码已过期" }); // 验证码过期
    return;
  }
  if (
    captcha.captchaText.toLocaleLowerCase() !==
    body.captchaText.toLocaleLowerCase()
  ) {
    res.status(400).json({ message: "验证码错误" }); // 验证码错误
    return;
  }
  next();
};

export default {
  create,
  captcha_cache,
  login,
  captchaList_chache,
  login_validator,
  captcha_validator,
};
