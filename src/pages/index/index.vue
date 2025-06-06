<template>
  <!-- <view :style="safeContainer" class="container"> -->
  <!-- <SafeView class="container">
    <Search class="container_header" />

    <GoodsList class="container_goods" />

    <l-tabbar />
  </SafeView> -->
  <!-- </view> -->
  <Layout>
    <template #header>
      <Search />
    </template>
    <template #body>
      <GoodsList />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import Search from "@/components/Search.vue";
// import { useSafeDistanceStore } from "@/stores/safeDistance";
import GoodsList from "@/components/GoodsList/index.vue";
import SafeView from "@/components/SafeView.vue"
import Layout from '@/components/layout/index.vue';

// const safeDistanceStore = useSafeDistanceStore();
// // const safeContainer = computed<CSSProperties>(() => ({
// //   // paddingTop: `${safeDistanceStore.topSafeAreaHeight}px`,
// //   paddingBottom: `env(safe-area-inset-bottom)`,
// // }));

// const safeSearch = computed<CSSProperties>(() => ({
//   paddingTop: `${safeDistanceStore.topSafeAreaHeight}px`,
//   // #ifdef MP-WEIXIN
//   paddingRight:'6rem'
//   // #endif
// }));
</script>

<style lang="scss" scpoed>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: $my-bg-gray;
}

.container_header {
  // position: sticky;
  // top: 0;
  // z-index: 99;
  background-color: white;
}

.container_goods {
  flex: 1;
  overflow: auto;
  padding-bottom: 100px !important;
}
</style>
