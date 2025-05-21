import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

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
  // },
});
