import axios from "axios"; // InternalAxiosRequestConfig, // AxiosError, // AxiosResponse,
import { UniAdapter } from "uniapp-axios-adapter";

var baseURL;

// #ifdef MP-WEIXIN
baseURL = "http://localhost:7200/api";
// #endif

// #ifdef WEB
baseURL = "/api";
// #endif

const http = axios.create({
  baseURL,
  timeout: 10000,
  adapter: UniAdapter, // 指定适配器
});

// 请求拦截器
http.interceptors.request.use(
  (config: any) => {
    // 可以在这里添加token等
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default http;
