<!-- 包含头中低的布局 -->
<template>
  <view class="layout-container">
    <view class="layout-header" :style="cpHeader">
      <slot name="header" />
    </view>
    <view class="layout-body">
      <slot name="body" />
    </view>
    <view class="layout-footer" v-if="props.showTabBar">
      <LTabBar />
    </view>
  </view>
</template>

<script setup lang="ts">
import LTabBar from '@/components/LTabBar.vue';
import { useSafeDistanceStore } from '@/stores/safeDistance';
import { computed, type CSSProperties } from 'vue';

const props = defineProps({
  showTabBar: {
    type: Boolean,
    default: true
  }
})

const safeDistanceStore = useSafeDistanceStore();
const cpHeader = computed<CSSProperties>(() => {
  return {
    paddingTop: `${safeDistanceStore.topSafeAreaHeight}px`
  }
})
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .layout-header {
    background-color: white;
  }

  .layout-body {
    flex: 1;
    overflow: auto;
  }

  .layout-footer {
    height: 50px;
  }
}
</style>
