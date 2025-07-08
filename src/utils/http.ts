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

const getResponse = (res: any, config: any) => {
  const { statusCode, errMsg } = res;
  const response = {
    ...res,
    status: statusCode,
    statusText: errMsg,
    config,
    request: null,
  };

  return response;
};
const http = axios.create({
  baseURL,
  timeout: 10000,
  adapter: (config: InternalAxiosRequestConfig) => {
    if (!uni) {
      throw new Error("please use this in uni-app project!");
    }
    return new Promise((resolve, reject) => {
      const { baseURL = "", url, headers, data, params } = config;
      const uniConfig = {
        ...config,
        url: baseURL + url,
        header: headers,
      };

      if (data || params) {
        try {
          uniConfig.data = JSON.parse(data || params);
        } catch (e) {
          uniConfig.data = data || params;
        }
      }
      uni.request({
        ...uniConfig,
        header: {
          ...uniConfig.headers, //不懂 这样小程序才能传递header
        },
        method: uniConfig.method as any,
        success(res) {
          const response = getResponse(res, config);
          resolve(response);
        },
        fail(res) {
          const response = getResponse(res, config);
          reject(response);
        },
      });
    });
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig & any) => {
    config.headers["Content-Type"] = "application/json; charset=utf-8";
    config.headers["authorization"] = uni.getStorageSync("token");
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
    if (response.status === 401) {
      uni.showToast({
        title: "请先登录",
      });
      uni.navigateTo({
        url: "/pages/login/index",
      });
      return Promise.reject(response);
    }
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
