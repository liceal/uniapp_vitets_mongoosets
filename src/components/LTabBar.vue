<template>
  <view>
    <u-tabbar v-model="activeTabbar" :list="pageList" @change="tabbarChange" active-color="red" />
  </view>
</template>
<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue'
// import pagesJson from '@/pages.json'

const pageList = reactive([
  {
    text: "首页",
    iconPath: 'home',
    selectedIconPath: 'home-fill',
    pagePath: "/pages/index/index",
    midButton: true
  },
  {
    text: "我的",
    iconPath: 'account',
    selectedIconPath: 'account-fill',
    pagePath: "/pages/mine/mine",
  }
])

const activeTabbar = ref(0)

onShow(() => {
  // 可以获取pageJson进行设置上面的路由
  // console.log(pagesJson.tabBar);
  const pages = getCurrentPages();
  console.log(pages, 2);
  const currentPage = pages[pages.length - 1]?.route;
  const currentIndex = pageList.findIndex(item => item.pagePath === `/${currentPage}`);
  console.log(currentIndex);
  activeTabbar.value = currentIndex
})

const tabbarChange = (index: number) => {
  uni.switchTab({
    url: pageList[index].pagePath
  })
}
</script>
<style lang="scss" scoped></style>