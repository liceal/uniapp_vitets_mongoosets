<template>
  <view>
    <u-tabbar v-model="activeTabbar" :list="pageList" @change="tabbarChange" active-color="red" class="tabbar" />
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
    pagePath: "/pages/mine/index",
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
<style lang="scss" scoped>
.tabbar {

  // 去除超出的部分 保持高度50px
  :deep(.u-tabbar__content) {
    .u-tabbar__content__item {
      box-sizing: border-box;
      padding: 0px;

      .u-tabbar__content__item__button {
        top: 0;
      }
    }
  }
}
</style>