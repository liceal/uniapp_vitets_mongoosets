<template>
  <Layout>
    <template #header>
      <view class="flex justify-between items-center relative border-b-solid border-b-gray1 p-2">
        <view class="absolute w-full text-center left-0">
          我的订单
        </view>
        <u-icon name="arrow-left" />
        <u-icon name="search" />
      </view>
      <view>
        <u-tabs-swiper ref="tabsSwiper" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
          swiperWidth="750"></u-tabs-swiper>
      </view>
    </template>
    <template #body>
      <swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="h-full">
        <swiper-item v-for="(item, index) in 6" :key="index">
          <scroll-view scroll-y class="h-full">
            <view class="bg-gray-1 flex flex-col gap-1">
              <view v-for="i in 20" :key="i" class="bg-white">
                <Item />
              </view>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </template>
  </Layout>
</template>

<script setup lang='ts'>
import Layout from '@/components/layout/index.vue'
import { ref } from 'vue';
import Item from './item.vue'

const list = ref([
  { name: '全部' },
  { name: '待付款' },
  { name: '拼团中' },
  { name: '打包中' },
  { name: '待收货' },
  { name: '评价' }
])
const current = ref(0)
const swiperCurrent = ref(0)
const tabsSwiper = ref()
function tabsChange(index: number) {
  swiperCurrent.value = index
}
// swiper-item左右移动，通知tabs的滑块跟随移动
function transition(e: any) {
  let dx = e.detail.dx;
  tabsSwiper.value.setDx(dx);
}
// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
// swiper滑动结束，分别设置tabs和swiper的状态
function animationfinish(e: any) {
  let current = e.detail.current;
  tabsSwiper.value.setFinishCurrent(current);
  swiperCurrent.value = current;
  current.value = current;
}


</script>

<style lang='scss' scoped></style>