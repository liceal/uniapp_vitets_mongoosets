<template>
  <view class="search-container" @click="toSearch" :style="safeStyle">
    <view style="display: flex;width:100%;align-items: center;height: 2rem;position: relative;">
      <u-icon name="arrow-left" style="padding:0 .5rem;font-size: 1rem;" v-if="props.isSearch"
        class="animate__fadeInLeft" @click="back" />
      <view class="search-content" style="padding:0 .3rem;flex:1;position: relative;align-items: center;height: 100%;">
        <view v-if="props.isSearch" style="position: relative;color: #333;">
          <view style="display: flex;align-items: center;padding-right: .3em;" @click="openType">
            {{ searchType === 1 ? '商品' : '店铺' }}
            <u-icon name="arrow-down-fill" style="font-size: .5em;line-height: 1em;" />
          </view>
          <transition name="fade">
            <view class="popup-with-arrow" v-if="showTypes"
              style="position: absolute;display: flex;flex-direction: column;background-color: white;z-index: 99;padding: .2rem .7rem;">
              <text :class="{ 'active-type': searchType === 1 }" @click="() => checkType(1)">商品</text>
              <text class="divider" />
              <text :class="{ 'active-type': searchType === 2 }" @click="() => checkType(2)">店铺</text>
            </view>
          </transition>
        </view>
        <view style="flex:1;position: relative;height: 100%;">
          <!-- 进搜索有这个输入框 -->
          <input v-if="props.isSearch" ref="inputRef" v-model="searchValue" style="padding-right: calc(.3rem + 24px);"
            class="des uni-input" :class="props.isSearch ? 'des-move' : 'des-center'" placeholder="描述文字" focus />
          <!-- 描述文字 没有输入内容时候 显示这个 -->
          <view v-else id="desText" class="des" :class="props.isSearch ? 'des-move' : 'des-center'">
            描述文字
          </view>
        </view>
        <u-icon name="camera" class="camera" style="position: absolute;right: .3rem;" @click="cameraClick" />
      </view>
      <text style="color:red;padding:0 .5rem;" v-if="props.isSearch">搜索</text>

    </view>
    <!-- {{ isSearch }}

    <button @click="() => isSearch = !isSearch">变换</button> -->
  </view>
</template>

<script lang='ts' setup>
// import { useSafeDistanceStore } from '@/stores/safeDistance';
import gsap from 'gsap';
import { computed, type CSSProperties, onMounted, ref } from 'vue';

// import { Icon } from '@iconify/vue';
// 推荐内容轮播

// const isSearch = ref(true)

const props = defineProps({
  // 是否在搜索页面
  isSearch: {
    type: Boolean,
    default: false
  }
});

const searchValue = ref<string>('');

// gsap搜索字的过渡动画

const cameraClick = (e: any) => {

  // 动画的demo
  // gsap.to('#desText', {
  //   x: 100, // 水平移动 100px
  //   opacity: 1, // 最终透明度为 1
  //   duration: 1, // 动画时长 1 秒
  //   ease: 'power2.out' // 缓动函数
  // })

  console.log('点击了相机', e);
  // const ctx = uni.createCameraContext();
  // ctx.takePhoto({
  //   quality: 'high',
  //   success: (res) => {
  //     console.log(res);

  //   },
  //   fail: (err) => {
  //     console.log(err);
  //   }
  // });
}

const toSearch = () => {
  if (props.isSearch) return;
  console.log('点击了搜索');
  uni.navigateTo({
    url: '/pages/search/index'
  });
}

type searchTypes =
  | 1 // 商品;
  | 2 // 店铺;
const showTypes = ref(false);
const searchType = ref<searchTypes>(1)
function openType() {
  showTypes.value = !showTypes.value;
}
function checkType(type: searchTypes) {
  console.log('选择了类型:', type);
  showTypes.value = false;
  searchType.value = type;
}

function back() {
  console.log('返回');
  uni.switchTab({
    url: '/pages/index/index'
  });
}

// const safeDistanceStore = useSafeDistanceStore();
const safeStyle = computed<CSSProperties>(() => ({
  // paddingTop: `${safeDistanceStore.topSafeAreaHeight}px`,
  // #ifdef MP-WEIXIN
  paddingRight: '6rem'
  // #endif
}));
</script>

<style lang="scss" scoped>
// 微信小程序右上角功能的高度
// $wxTopButtonHeight: 33px;
// $wxTopButtonWidth: 100px;

// .search-container {
//   background-color: white;
//   padding: .2rem;
//   position: relative;
//   color: #ab9aa0 !important;
//   height: 2rem;

//   // #ifdef MP-WEIXIN
//   height: $wx-top-button-height;
//   padding-right: $wx-top-button-width;
//   // #endif

//   .search-input {
//     box-sizing: border-box;
//     width: 100%;
//     height: 100%;
//     // padding: .5rem 1rem;
//     background-color: #ededed;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border-radius: .5rem;
//     position: relative;

//     &-text {
//       display: flex;
//     }
//   }

//   .search-input-camera {
//     position: absolute;
//     right: 1rem;
//     font-size: 1.5rem;
//     top: 0.5rem;
//   }
// }

.search-container {
  background-color: white;
  padding: .2em .5em;
  width: 100%;
  box-sizing: border-box;
}

.search-content {
  display: flex;
  background-color: #ededed;
  color: #ab9aa0 !important;
  border-radius: .5rem;
}

.camera {
  font-size: 1.5rem;
  color: gray;
}

.des {
  position: absolute;
  top: 0px;
  height: 100%;
  display: flex;
  align-items: center;
  // transition: all 0.5s ease;
}

.des-center {
  left: 50%;
  transform: translateX(-50%);
}

.des-move {
  animation: move .2s ease;

}

@keyframes move {
  from {
    left: 50%;
    transform: translateX(-50%);
  }

  to {
    left: 0;
    transform: translateX(0);
  }
}

// .des-center {
//   transition: none;
//   left: 50%;
//   transform: translateX(-50%);
// }


.popup-with-arrow {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: white;
  z-index: 99;
  padding: .2rem .5rem;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  left: -.5em;
  width: 2em;
  top: 2em;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: -5px;
    border: 1px solid #e4e7ed;
    width: 8px;
    height: 8px;
    transform: translateX(-50%) rotate(45deg);
    background-color: white;
    border-bottom-color: transparent !important;
    border-right-color: transparent !important;
  }
}

.active-type {
  color: red;
}

/* 定义淡入淡出过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  /* 增加垂直位移效果 */
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #e4e7ed;
  margin: .3em 0;
}

.uni-input {
  color: #333;
}
</style>