<template>
  <view class="search-container">
    <view class="search-input" @click="searchClick">
      <!-- 小程序失效 -->
      <!-- <Icon icon="ant-design:fire-filled" class="icon" /> -->
      <u-icon name="search" />
      <text>推荐内容</text>
    </view>
    <u-icon name="camera" class="search-input-camera" @click="cameraClick" />
  </view>
</template>

<script lang='ts' setup>
// import { Icon } from '@iconify/vue';
// 推荐内容轮播


const cameraClick = (e: any) => {
  console.log('点击了相机');
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

const searchClick = () => {
  console.log('点击了搜索');
  uni.navigateTo({
    url: '/pages/search/index'
  });
}
</script>

<style lang="scss" scoped>
// 微信小程序右上角功能的高度
// $wxTopButtonHeight: 33px;
// $wxTopButtonWidth: 100px;

.search-container {
  background-color: white;
  padding: .2rem;
  position: relative;
  color: #ab9aa0 !important;
  height: 2rem;

  // #ifdef MP-WEIXIN
  height: $wx-top-button-height;
  padding-right: $wx-top-button-width;
  // #endif

  .search-input {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    // padding: .5rem 1rem;
    background-color: #ededed;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1rem;
    position: relative;

    &-text {
      display: flex;
    }
  }

  .search-input-camera {
    position: absolute;
    right: 1rem;
    font-size: 1.5rem;
    top: 0.5rem;
  }
}
</style>