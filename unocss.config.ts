// uno.config.ts
import { defineConfig, presetWind3, transformerDirectives } from "unocss";
import { presetUni } from "@uni-helper/unocss-preset-uni";

export default defineConfig({
  presets: [
    presetUni({
      attributify: false,
    }),
    presetWind3() as any, // 核心预设
  ],
  transformers: [
    transformerDirectives(), // 启用指令功能
  ],
  // 自定义规则
  // rules: [["m-1", { margin: "0.25rem" }]],
  // 快捷方式
  shortcuts: {
    btn: "py-2 px-4 rounded bg-blue-500 text-white",
    "border-top-ef":
      "border-t-[0.5em] border-solid border-[#efefef] border-b-0 border-l-0 border-r-0",
  },
  // postprocess(util) {
  //   // rem 转 rpx
  //   util.entries.forEach((i) => {
  //     const value = i[1];
  //     if (value && typeof value === "string" && remRE.test(value))
  //       i[1] = `${Number(value.slice(0, -3)) * 16 * 2}rpx`;
  //   });
  // },
});
