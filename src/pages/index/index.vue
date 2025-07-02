<template>
  <Layout showTabbar isCustomNavBar topSafe>
    <template #header>
      <Search />
      <view>
        <u-tabs-swiper ref="tabsSwiper" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
          swiperWidth="750"></u-tabs-swiper>
      </view>
    </template>
    <template #body class="h-full">
      <!-- <GoodsList ref="goodsListRef" /> -->
      <swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="h-full">
        <swiper-item v-for="(item, k) in list" :key="k" class="h-full">
          <scroll-view scroll-y class="h-full" @scrolltolower="(e: any) => bodyScrollToLower(e, k, item)">
            <GoodsList :ref="(instance) => handleGoodsListRef(k, instance)" />
          </scroll-view>
        </swiper-item>
      </swiper>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Search from "@/components/Search.vue";
import GoodsList from "@/components/GoodsList.vue";
import Layout from '@/components/layout/index.vue';

const list = ref([
  { name: '热门', type: 1 },
  { name: '男装', type: 2 },
  { name: '女装', type: 3 },
  { name: '百货', type: 4 },
  { name: '水果', type: 5 },
  { name: '蔬菜', type: 6 }
])

const goodsListRefs = ref<{ [index: number]: InstanceType<typeof GoodsList> }>({});

// 处理 GoodsList 组件的 ref
function handleGoodsListRef(index: number, instance: any) {
  goodsListRefs.value[index] = instance;
  if (!goodsListRefs.value[index]) {
    goodsListRefs.value[index] = instance;
  }
}

// const goodsListRef = ref<InstanceType<typeof GoodsList>>()
function bodyScrollToLower(e: any, index: number, item: { name: string, type: number }) {
  console.log('index 到底了', e, index, item);

  if (goodsListRefs.value[index]) {
    goodsListRefs.value[index].lowerBottom(e)
  }
}

const current = ref(0)
const swiperCurrent = ref(0)
const tabsSwiper = ref()
function tabsChange(index: number) {
  swiperCurrent.value = index
}
// swiper-item左右移动，通知tabs的滑块跟随移动
function transition(e: any) {
  // console.log(e);

  let dx = e.detail.dx;
  tabsSwiper.value.setDx(dx);
}
// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
// swiper滑动结束，分别设置tabs和swiper的状态
function animationfinish(e: any) {
  let _current = e.detail.current;
  tabsSwiper.value.setFinishCurrent(_current);
  swiperCurrent.value = _current;
  current.value = _current;
}
</script>

<style lang="scss" scpoed>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: $my-bg-gray;
}

.container_header {
  // position: sticky;
  // top: 0;
  // z-index: 99;
  background-color: white;
}

.container_goods {
  flex: 1;
  overflow: auto;
  padding-bottom: 100px !important;
}
</style>
