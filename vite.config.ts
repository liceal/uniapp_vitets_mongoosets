import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const Unocss = await import("unocss/vite").then((i) => i.default);
  return {
    plugins: [uni(), Unocss()],
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
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_GEN_PROXY_PATH, // 目标服务器地址
          changeOrigin: true, // 是否改变源
          rewrite: function (path) {
            console.log(`请求地址：${this.target}  ${path}`);

            return path.replace(/^\/api/, "");
          }, // 重写路径
        },
        "/ws": {
          target: env.VITE_WS_PROXY_PATH,
          ws: true,
          changeOrigin: true,
        },
      },
    },
  };
});
