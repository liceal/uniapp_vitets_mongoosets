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

    <u-popup v-model="popupVisible" mode="bottom" z-index="199">
      <view class="h-100vh bg-white box-border flex flex-col" :style="cpHeader">
        <view class="p-2 bg-white">
          <u-icon name="close" @click="closePopup" />
        </view>
        <scroll-view @scrolltolower="onScrolltolowerPopup" scroll-y class="flex-1 overflow-auto">
          <slot name="popup" />
        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import LTabBar from '@/components/LTabBar.vue';
import { useSafeDistanceStore } from '@/stores/safeDistance';
import { computed, ref, type CSSProperties } from 'vue';

const emits = defineEmits(['bodyScrollToLower', 'popupScrollToLower'])

function onScrolltolower(e: any) {
  // console.log('layout 到底了', e);
  emits('bodyScrollToLower', e)
}
function onScrolltolowerPopup(e: any) {
  emits('popupScrollToLower', e)
}

const props = defineProps({
  // 显示底部tabbar
  showTabbar: {
    type: Boolean,
    default: false
  },
  bgGray: {
    type: Boolean,
    default: true
  }
})

const safeDistanceStore = useSafeDistanceStore();
const cpHeader = computed<CSSProperties>(() => {
  return {
    paddingTop: `${safeDistanceStore.topSafeAreaHeight}px`,
    background: props.bgGray ? '#efefef' : 'white'
  }
})

// 关于弹窗的
const popupVisible = ref(false)
function openPopup() {
  popupVisible.value = true
}
function closePopup() {
  popupVisible.value = false
}

defineExpose({
  openPopup,
  closePopup
})
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;

  .layout-header {
    background-color: white;
  }

  .layout-body {
    flex: 1;
    overflow: auto;
  }

  .layout-footer {
    z-index: 99 !important;
    // #ifdef WEB
    height: calc(50px);
    // #else
    height: calc(50px + var(safe-area-inset-bottom));
    // #endif
  }
}
</style>
