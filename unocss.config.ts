// uno.config.ts
import { defineConfig, presetWind3, transformerDirectives } from "unocss";

export default defineConfig({
  presets: [
    presetWind3(), // 核心预设
  ],
  transformers: [
    transformerDirectives(), // 启用指令功能
  ],
  // 自定义规则
  // rules: [["m-1", { margin: "0.25rem" }]],
  // 快捷方式
  shortcuts: {
    btn: "py-2 px-4 rounded bg-blue-500 text-white",
  },
});
