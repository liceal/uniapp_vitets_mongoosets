import axios from "axios"; // InternalAxiosRequestConfig, // AxiosError, // AxiosResponse,

const http = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
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
