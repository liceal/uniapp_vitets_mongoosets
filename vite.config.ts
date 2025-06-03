import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { HttpProxy } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  // css: {
  // preprocessorOptions: {
  //   scss: {
  //     additionalData: `
  //       @use "@/styles/variables.scss" as *;
  //       @use "@/styles/global.scss" as *;
  //       @use "@/styles/mixins.scss" as *;
  //     `,
  //   },
  // },
  // },'
  resolve: {
    alias: {
      "@": "/src",
      "#": "/server",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:7200", // 目标服务器地址
        changeOrigin: true, // 是否改变源
        rewrite: function (path) {
          console.log(`请求地址：${this.target}${path}`);

          return path.replace(/^\/api/, "/api");
        }, // 重写路径
      },
    },
  },
});
