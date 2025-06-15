<template>
  <Layout>
    <template #header>
      <view class="flex justify-between items-center relative border-b-solid border-b-gray1 p-2">
        <view class="absolute w-full text-center left-0">
          我的订单
        </view>
        <u-icon name="arrow-left" @click="back" />
        <u-icon name="search" />
      </view>
      <view>
        <u-tabs-swiper ref="tabsSwiper" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
          swiperWidth="750"></u-tabs-swiper>
      </view>
    </template>
    <template #body>
      <swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="h-full">
        <swiper-item v-for="(item, k) in orderItems" :key="k">
          <scroll-view scroll-y class="h-full" @scrolltolower="lowerBottom">
            <view class="bg-gray-1 flex flex-col gap-1">
              <view v-for="i in item" :key="i.id as any" class="bg-white">
                <OrderItem v-bind="i" />
              </view>
            </view>
            <u-divider v-if="isFetch">
              <view class="flex items-center gap-1">
                加载中<u-loading mode="circle" size="20" />
              </view>
            </u-divider>
          </scroll-view>
        </swiper-item>
        <swiper-item>
          评价
        </swiper-item>
      </swiper>
    </template>
  </Layout>
</template>

<script setup lang='ts'>
import Layout from '@/components/layout/index.vue'
import { onMounted, ref } from 'vue';
import OrderItem from './orderItem.vue'
import { back } from '@/utils';
import order from '@/api/order';
import type { OrderStatus, OrderTypes } from 'types/server';
import { onLoad } from '@dcloudio/uni-app';

const list = ref([
  { name: '全部' },
  { name: '待付款' },
  { name: '拼团中' },
  { name: '打包中' },
  { name: '待收货' },
  { name: '评价' }
])

// swiper每个对应的状态
const swiperIndexToStatus: Record<number, OrderStatus> = [1, 10, 20, 30, 40]

// 订单分类
const orderItems = ref<Partial<Record<OrderStatus, OrderTypes[]>>>({
  1: [],
  10: [],
  20: [],
  30: [],
  40: []
})

const current = ref(0)
const swiperCurrent = ref(0)
const tabsSwiper = ref()
function tabsChange(index: number) {
  swiperCurrent.value = index
}
// swiper-item左右移动，通知tabs的滑块跟随移动
function transition(e: any) {
  console.log(e);

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

// 订单列表
// const orderList = ref<OrderTypes[]>([])
const page = ref(1)
const isFetch = ref(false)
const nowStatus = ref<OrderStatus>(swiperIndexToStatus[swiperCurrent.value])
async function getOrderList(_status: OrderStatus) {
  const res = await order.orderList
    .post({ limit: 3, page: page.value, status: _status })
  if (isFetch.value) {
    // 如果没数据则回滚页数
    if (!res.data.length) {
      page.value--;
      return;
    }

    orderItems.value[_status] = [...orderItems.value[_status] || [], ...res.data]
    return;
  }
  orderItems.value[_status] = res.data
}

async function lowerBottom(e: any) {
  console.log('到底了', e)
  if (!isFetch.value) {
    page.value++
    isFetch.value = true
    await getOrderList(nowStatus.value)
    isFetch.value = false
  }
}

onMounted(() => {
  // 首次请求所有类型的
  getOrderList(1)
  getOrderList(10)
  getOrderList(20)
  getOrderList(30)
  getOrderList(40)
})

onLoad((options) => {
  console.log(options);
  if (options?.type) {
    current.value = options.type
    swiperCurrent.value = current.value
    nowStatus.value = swiperIndexToStatus[options.type]
  }
})

</script>

<style lang='scss' scoped></style>