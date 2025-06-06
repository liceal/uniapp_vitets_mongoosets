<!-- 包含头中低的布局 -->
<template>
  <view class="container">
    <view class="header" :style="cpHeader">
      <slot name="header" />
    </view>
    <view class="body">
      <slot name="body" />
    </view>
    <view class="footer" v-if="props.showTabBar">
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
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .header {
    background-color: white;
  }

  .body {
    flex: 1;
    overflow: auto;
  }

  .footer {
    height: 50px;
  }
}
</style>
