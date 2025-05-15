import { createSSRApp } from "vue";
import App from "./App.vue";
import uView from "vk-uview-ui";
import CustomTabBar from "./components/LTabBar.vue";
export function createApp() {
  const app = createSSRApp(App);
  app.use(uView);

  app.component("l-tabbar", CustomTabBar);
  return {
    app,
  };
}
