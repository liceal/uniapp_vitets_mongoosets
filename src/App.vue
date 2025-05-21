<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useSafeDistanceStore } from "./stores/safeDistance";

const safeDistanceStore = useSafeDistanceStore();

onLaunch(() => {
  console.log("App Launch");

  // 获取安全距离
  const app = uni.getSystemInfoSync();
  const topSafeAreaHeight = app.statusBarHeight;
  console.log(app)
  console.log("顶部安全距离", topSafeAreaHeight);

  // 将安全距离存储到 Pinia
  safeDistanceStore.setTopSafeAreaHeight(topSafeAreaHeight);
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
