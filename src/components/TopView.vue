<template>
  <view class="top-view" :style="cpHeader">
    <slot>
      <view class="flex justify-between px-1rem pb-2 relative">
        <view v-if="!!title" class="absolute text-center left-0 top-1 w-full text-lg font-bold"
          :style="{ opacity: alpha }">{{ title }}</view>
        <u-icon name="arrow-left" size="1.5rem" @click="back" class="rounded-full bg-gray  p-1" :style="cpIconStyle" />
        <u-icon name="share-fill" size="1.5rem" class="rounded-full bg-gray p-1" :style="cpIconStyle" />
      </view>
    </slot>
  </view>
</template>

<script setup lang='ts'>
import { useSafeDistanceStore } from '@/stores/safeDistance';
import { back } from '@/utils';
import { computed, ref, type CSSProperties } from 'vue';

const props = defineProps({
  virtual: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  }
})

const safeDistanceStore = useSafeDistanceStore();
// 定义滚动距离
const scrollTop = ref(0);
// 定义最大滚动距离，超过该距离颜色不再变化
const maxScroll = 200;

const alpha = computed<number>(() => {
  return Math.min(scrollTop.value / maxScroll, 1);
})
// 计算样式
const cpHeader = computed<CSSProperties>(() => {
  // 根据滚动距离计算透明度，范围 0 到 1
  return {
    paddingTop: `${safeDistanceStore.topSafeAreaHeight || 20}px`,
    // 使用 rgba 颜色，根据透明度变化
    backgroundColor: `rgba(255, 255, 255, ${alpha.value})`,
    position: props.virtual ? 'fixed' : 'sticky'
  };
});

// 计算图标颜色
const cpIconStyle = computed<CSSProperties>(() => {
  let color_f = Math.floor(255 - alpha.value * 255)
  return {
    // 背景透明度从0.5到0 (随着alpha增加而减少)
    '--un-bg-opacity': (0.5 * (1 - alpha.value)).toFixed(2),
    // 文字颜色从黑色到白色 (alpha越大，颜色越白)
    color: `rgba(${color_f}, ${color_f}, ${color_f}, 1)`,
  }
})

// 计算 中间文字的样式
const cpTitleStyle = computed<CSSProperties>(() => {
  return {
    opacity: (0.5 * (alpha.value - 1)).toFixed(2),
  }
})

// 滚动事件处理函数
const onScroll = (e: any) => {
  // console.log(e);

  scrollTop.value = e.detail.scrollTop;
};

defineExpose({
  onScroll
})

</script>

<style lang='scss' scoped>
.top-view {
  top: 0;
  z-index: 99;
  width: 100%;
  box-sizing: border-box;
}
</style>