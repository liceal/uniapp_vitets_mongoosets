<!-- 包含头中低的布局 -->
<template>
  <view class="layout-container" :style="cpHeader">
    <view>
      <slot name="header" />
    </view>
    <scroll-view @scrolltolower="onScrolltolower" scroll-y class="layout-body">
      <slot name="body" />
    </scroll-view>
    <view class="layout-footer" v-if="props.showTabbar">
      <LTabBar />
    </view>
  </view>
</template>

<script setup lang="ts">
import LTabBar from '@/components/LTabBar.vue';
import { useSafeDistanceStore } from '@/stores/safeDistance';
import { computed, type CSSProperties } from 'vue';

const emits = defineEmits(['bodyScrollToLower'])

function onScrolltolower(e: any) {
  // console.log('layout 到底了', e);
  emits('bodyScrollToLower', e)
}

const props = defineProps({
  // 显示底部tabbar
  showTabbar: {
    type: Boolean,
    default: false
  },
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
