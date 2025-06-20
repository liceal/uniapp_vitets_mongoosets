import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios"; // InternalAxiosRequestConfig, // AxiosError, // AxiosResponse,
import { UniAdapter } from "uniapp-axios-adapter";

var baseURL;

// #ifdef MP-WEIXIN
baseURL = import.meta.env.VITE_GEN_PROXY_PATH;
// #endif

// #ifdef APP-PLUS
baseURL = import.meta.env.VITE_GEN_PROXY_PATH;
// #endif

// #ifdef WEB
baseURL = import.meta.env.VITE_APP_BASE_API;
// #endif

const http = axios.create({
  baseURL,
  timeout: 10000,
  adapter: UniAdapter, // 指定适配器
});

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers["Content-Type"] = "application/json; charset=utf-8";

    // 可以在这里添加token等
    return config;
  },
  (error: any) => {
    console.log("请求错误", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse["data"] => {
    // console.log("http", response);
    if (response.status === 400) {
      uni.showModal({
        title: "请求错误",
        content: response.data.message,
        showCancel: false,
        confirmText: "确定",
        success: (res) => {
          if (res.confirm) {
            console.log("用户点击确定");
          }
        },
      });
      return Promise.reject(response);
    }
    if (response.status === 404) {
      uni.showModal({
        title: "接口不存在",
        content: response.data.message,
        showCancel: false,
        confirmText: "确定",
        success: (res) => {
          if (res.confirm) {
            console.log("用户点击确定");
          }
        },
      });
      return Promise.reject(response);
    }
    if (response.status === 500) {
      uni.showModal({
        title: "服务器内部错误",
        content: response.data.message,
        showCancel: false,
        confirmText: "确定",
        success: (res) => {
          if (res.confirm) {
            console.log("用户点击确定");
          }
        },
      });
      return Promise.reject(response);
    }
    return response.data;
  },
  (error: any) => {
    console.log("响应错误", error);
    return Promise.reject(error);
  }
);

export default http;
