import http from "@/utils/http";
import type {
  CaptchaCacheTypes,
  UserLoginReqTypes,
  UserLoginResTypes,
} from "types/server";

export default {
  captchaCache: {
    url: "/user/captcha_cache",
    name: "创建验证码",
    get: async function (): Promise<CaptchaCacheTypes> {
      return await http.get(this.url);
    },
  },
  create: {
    url: "/user/create",
    name: "注册",
    post: async function (data?: any) {
      return await http.post(this.url, data);
    },
  },
  login: {
    url: "/user/login",
    name: "登录",
    post: async function (
      data?: UserLoginReqTypes
    ): Promise<UserLoginResTypes> {
      return await http.post(this.url, data);
    },
  },
};
