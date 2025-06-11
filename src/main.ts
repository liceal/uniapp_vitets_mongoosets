import { createSSRApp } from "vue";
import App from "./App.vue";
import uView from "vk-uview-ui";
import LTabBar from "./components/LTabBar.vue";
import pinia from "./stores";
import "animate.css";
import "virtual:uno.css";
import "@/styles/iconfont.css";
export function createApp() {
  const app = createSSRApp(App);
  app.use(uView);
  app.use(pinia);
  app.component("l-tabbar", LTabBar);
  return {
    app,
  };
}
