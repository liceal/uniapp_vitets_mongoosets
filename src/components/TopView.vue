<template>
  <view class="top-view" :style="cpHeader">
    <slot>
      <view class="top-view__goodsDetailHandler">
        <u-icon name="arrow-left" size="1.5rem" @click="back" />
        <u-icon name="share-fill" size="1.5rem" />
      </view>
    </slot>
  </view>
</template>

<script setup lang='ts'>
import { useSafeDistanceStore } from '@/stores/safeDistance';
import { back } from '@/utils';
import { onPageScroll } from '@dcloudio/uni-app';
import { computed, onMounted, onUnmounted, ref, type CSSProperties } from 'vue';

const safeDistanceStore = useSafeDistanceStore();
// 定义滚动距离
const scrollTop = ref(0);
// 定义最大滚动距离，超过该距离颜色不再变化
const maxScroll = 200;

// 计算样式
const cpHeader = computed<CSSProperties>(() => {
  // 根据滚动距离计算透明度，范围 0 到 1
  const alpha = Math.min(scrollTop.value / maxScroll, 1);
  return {
    paddingTop: `${safeDistanceStore.topSafeAreaHeight}px`,
    // 使用 rgba 颜色，根据透明度变化
    backgroundColor: `rgba(255, 255, 255, ${alpha})`
  };
});

// 滚动事件处理函数
const pageScroll = (e: any) => {
  scrollTop.value = e.scrollTop;
};

//todo 根据滚动条改变颜色
onMounted(() => {
  // 监听页面滚动事件
  onPageScroll(pageScroll)
});
</script>

<style lang='scss' scoped>
.top-view {
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  box-sizing: border-box;

  .top-view__goodsDetailHandler {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }
}
</style>