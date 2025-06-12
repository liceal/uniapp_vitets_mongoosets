<template>
  <Layout @bodyScrollToLower="bodyScrollToLower" showTabbar>
    <template #body>

      <!-- 登录 用户 -->
      <view class="p-2">
        <u-button type="primary">登录</u-button>
      </view>

      <!-- 订单 -->
      <view class="grid grid-cols-3 gap-2 border-top-ef p-2">
        <view v-for="(item, k) in orderItems" :key="k" class="flex flex-col justify-center items-center h-[5rem] gap-2"
          @click="() => toOrder(item)">
          <!-- <u-icon name="order" size="60" />
          <uni-icons type="contact" size="30"></uni-icons> -->
          <text class="iconfont !text-[2rem]" :class="item.icon" />
          <text>{{ item.label }}</text>
        </view>
      </view>

      <!-- 商品 -->
      <view class="grid grid-cols-3 gap-2 border-top-ef p-2">
        <view v-for="(item, k) in goodsItems" :key="k" class="flex flex-col justify-center items-center h-[5rem] gap-2">
          <!-- <u-icon name="coupon-fill" size="60" class="text-red-6" /> -->
          <text class="iconfont !text-[2rem]" :class="item.icon" />
          <text>{{ item.label }}</text>
        </view>
      </view>

      <!-- 功能 -->
      <view class="grid grid-cols-3 gap-2 border-top-ef p-2">
        <view v-for="(item, k) in handleItems" :key="k" class="flex flex-col justify-center items-center h-[5rem]">
          <!-- <u-icon name="map" size="60" class="text-orange-4" /> -->
          <text class="iconfont !text-[2rem] text-orange-4" :class="item.icon" />
          <text>{{ item.label }}</text>
        </view>
      </view>

      <!-- 推荐商品 -->
      <view class="border-top-ef">
        <GoodsList ref="goodsListRef" />
      </view>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import GoodsList from '@/components/GoodsList.vue';
import { ref } from 'vue';
import { iconLoaded } from '@iconify/vue';

const goodsListRef = ref<InstanceType<typeof GoodsList>>()
function bodyScrollToLower(e: any) {
  console.log('mine到底了', e)
  goodsListRef.value?.lowerBottom(e)
}

const orderItems = ref([
  {
    icon: "icon-order",
    label: '全部订单'
  },
  {
    icon: "icon-pay",
    label: '待付款'
  },
  {
    icon: "icon-share1",
    label: '拼团中'
  },
  {
    icon: "icon-time",
    label: '打包中'
  },
  {
    icon: "icon-31daishouhuo",
    label: '待收货'
  },
  {
    icon: "icon-pingjia",
    label: '评价'
  },
])

const goodsItems = ref([
  {
    icon: 'icon-coupon',
    label: "优惠券"
  },
  {
    icon: 'icon-shangpinshoucang',
    label: "商品收藏"
  },
  {
    icon: 'icon-dianpuguanzhu',
    label: "店铺关注"
  },
  {
    icon: 'icon-wokanguoderen',
    label: "我看过的"
  },
  {
    icon: 'icon-tuikuanshouhou',
    label: "退款售后"
  },
])

const handleItems = ref([
  {
    icon: 'icon-shouhuodizhi',
    label: "收货地址"
  },
  {
    icon: 'icon-guanfangkefu',
    label: "官方客服"
  },
  {
    icon: 'icon-shezhi',
    label: "设置"
  },
])

function toOrder(item: { icon: string, label: string }) {
  console.log(item)
  uni.navigateTo({
    url: '/pages/order/index'
  })
}
</script>

<style scoped></style>