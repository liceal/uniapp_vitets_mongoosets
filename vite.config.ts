import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
/** 此路径根据自己项目路径修改；默认为 uniapp 插件市场导入路径；*/
// import viteVueUnocss, { unocss } from "./js_sdk/a-hua-unocss";
// import Unocss from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const Unocss = await import("unocss/vite").then((i) => i.default);
  return {
    plugins: [
      uni(),
      Unocss(),
      // viteVueUnocss({
      //   /** 预设数组；默认[unocss()] */
      //   presets: [
      //     /**
      //      * 默认预设；
      //      * text-24、uno-text-24、xx-text-24
      //      */
      //     unocss(),
      //   ],
      // }),
    ],
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
            console.log(`请求地址：${this.target}${path}`);

            return path.replace(/^\/api/, "/api");
          }, // 重写路径
        },
      },
    },
  };
});
