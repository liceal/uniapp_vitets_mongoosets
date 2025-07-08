<!-- 包含头中低的布局 -->
<template>
  <!-- :class="{ 'safe-area-inset-bottom': !props.showTabbar }" -->
  <view class="layout-container" :style="cpContainerStyle">
    <view :style="cpHeaderStyle" v-if="props.topSafe">
      <!-- 顶部占位 -->
    </view>
    <view>
      <slot name="header" />
    </view>
    <!-- 两种body 一个自动大小 一个放scroll里面自适应 -->
    <scroll-view v-if="props.bodyScroll" @scrolltolower="onScrolltolower" @scroll="onScroll" scroll-y
      class="layout-body" :class="bgGray ? 'bg-gray-1' : 'bg-white'" @click="bodyClick" :scroll-top="bodyScrollTop">
      <!-- 顶部虚拟位 -->
      <TopView ref="topViewRef" v-if="props.topVirtual" :title="props.topVirtualTitle" />
      <!-- body 顶部透明安全距离 -->
      <view v-if="props.topBodySafe" class="bg-white" :style="{ height: `${safeDistanceStore.topSafeAreaHeight}px` }">
      </view>
      <slot name="body" />
    </scroll-view>
    <slot name="body" v-else />

    <view class="layout-footer">
      <slot name="footer" />
    </view>

    <view class="layout-tabbar" v-if="props.showTabbar">
      <LTabBar />
    </view>
    <view v-else class="h-[env(safe-area-inset-bottom)]">
      <!-- 底部占位 -->
    </view>

    <u-popup v-model="popupVisible" mode="bottom" z-index="199">
      <view class="bg-white box-border flex flex-col" :style="{ height: props.popupHeight }">
        <view v-if="props.popupHeight === '100vh'" :style="cpPopupTopStyle" @click="closePopup">
          <!-- 顶部占位 -->
        </view>
        <view class="p-2 bg-white" @click="closePopup">
          <u-icon name="arrow-down" />
        </view>
        <scroll-view @scrolltolower="onScrolltolowerPopup" scroll-y class="flex-1 overflow-auto">
          <slot name="popup" />
        </scroll-view>
        <view class="h-[env(safe-area-inset-bottom)]">
          <!-- 底部占位 -->
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import LTabBar from '@/components/LTabBar.vue';
import { useSafeDistanceStore } from '@/stores/safeDistance';
import { computed, ref, type CSSProperties } from 'vue';
import TopView from '../TopView.vue';

const emits = defineEmits(['bodyScrollToLower', 'popupScrollToLower', 'bodyClick'])

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
  // 灰色背景
  bgGray: {
    type: Boolean,
    default: true
  },
  // 是否自定义顶部
  isCustomNavBar: {
    type: Boolean,
    default: false
  },
  popupHeight: {
    type: String,
    default: "100vh"
  },
  // 是否要顶部安全距离
  topSafe: {
    type: Boolean,
    default: false
  },
  // 是否要顶部虚拟占位
  topVirtual: {
    type: Boolean,
    default: false
  },
  topVirtualTitle: {
    type: String,
    default: ''
  },
  // body顶部安全距离 透明的
  topBodySafe: {
    type: Boolean,
    default: false
  },
  // body是否进行滚动条处理，如果不处理就是自动大小，如果一个layout页面 放在了layout的popup里面 要去掉bodyScroll
  bodyScroll: {
    type: Boolean,
    default: true
  }
})

const safeDistanceStore = useSafeDistanceStore();
const cpHeaderStyle = computed<CSSProperties>(() => {
  if (props.isCustomNavBar) {
    return {
      height: `${safeDistanceStore.topSafeAreaHeight}px`,
      background: 'white'
      // background: props.bgGray ? '#efefef' : 'white'
    }
  } else {
    return {
      background: 'white'
      // background: props.bgGray ? '#efefef' : 'white'
    }
  }
})

const cpPopupTopStyle = computed<CSSProperties>(() => {
  if (props.isCustomNavBar) {
    return {
      height: `${safeDistanceStore.topSafeAreaHeight}px`,
      background: 'white'
      // background: props.bgGray ? '#efefef' : 'white'
    }
  } else {
    return {
      background: 'white'
      // background: props.bgGray ? '#efefef' : 'white'
    }
  }
})

const cpContainerStyle = computed<CSSProperties>(() => {
  if (props.isCustomNavBar) {
    return {
      height: '100vh'
    }
  } else {
    // 使用条件编译指令动态设置高度
    let heightValue = 'calc(100vh)';
    // #ifdef WEB
    heightValue = 'calc(100vh - 44px)';
    // #else
    heightValue = 'calc(100vh)';
    // #endif
    return {
      height: heightValue
    };
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

const bodyScrollTop = ref()
const nowScrollTop = ref(0)
const topViewRef = ref<InstanceType<typeof TopView>>()
function onScroll(e: any) {
  topViewRef.value?.onScroll(e)
  nowScrollTop.value = e.detail.scrollTop
}

function bodyScrollToBottom() {
  console.log('到底部');

  bodyScrollTop.value = nowScrollTop.value + 999999
}

function bodyClick(e: any) {
  emits('bodyClick', e)
}

defineExpose({
  openPopup,
  closePopup,
  bodyScrollToBottom
})
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  // height: 100vh;
  box-sizing: border-box;


  .layout-header {
    background-color: white;
  }

  .layout-body {
    flex: 1;
    overflow: auto;
  }

  .layout-tabbar {
    z-index: 99 !important;
    // #ifdef WEB
    height: calc(50px);
    // #else
    height: calc(50px + env(safe-area-inset-bottom));
    // #endif
  }

  .layout-footer {
    background-color: white;
  }
}
</style>
