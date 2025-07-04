<template>
  <Layout @bodyScrollToLower="bodyScrollToLower" showTabbar ref="layoutRef" isCustomNavBar topBodySafe>
    <template #body>

      <!-- 登录 用户 -->
      <template v-if="userInfo">
        <view class="bg-white p-2 flex items-center gap-2">
          <u-avatar :src="userInfo.avatar" size="80" />
          用户：{{ userInfo.username }}
        </view>
      </template>
      <template v-else>
        <view class="p-2 bg-white">
          <u-button type="primary" @click="loginClick">登录</u-button>
        </view>
        <LoginPopup ref="loginPopupRef" />
      </template>

      <!-- 订单 -->
      <view class="grid grid-cols-3 gap-2 p-2 mt-2 bg-white">
        <view v-for="(item, k) in orderItems" :key="k" class="flex flex-col justify-center items-center h-[5rem] gap-2"
          @click="() => toOrder(item, k)">
          <!-- <u-icon name="order" size="60" />
          <uni-icons type="contact" size="30"></uni-icons> -->
          <text class="iconfont !text-[2rem]" :class="item.icon" />
          <text>{{ item.label }}</text>
        </view>
      </view>

      <!-- 商品 -->
      <view class="grid grid-cols-3 gap-2 p-2 mt-2 bg-white">
        <view v-for="(item, k) in goodsItems" :key="k" class="flex flex-col justify-center items-center h-[5rem] gap-2">
          <!-- <u-icon name="coupon-fill" size="60" class="text-red-6" /> -->
          <text class="iconfont !text-[2rem]" :class="item.icon" />
          <text>{{ item.label }}</text>
        </view>
      </view>

      <!-- 功能 -->
      <view class="grid grid-cols-3 gap-2 p-2 mt-2 bg-white">
        <view v-for="(item, k) in handleItems" :key="k" class="flex flex-col justify-center items-center h-[5rem]"
          @click="item.click">
          <!-- <u-icon name="map" size="60" class="text-orange-4" /> -->
          <text class="iconfont !text-[2rem] text-orange-4" :class="item.icon" />
          <text>{{ item.label }}</text>
        </view>
      </view>

      <!-- 推荐商品 -->
      <view class="mt-2 bg-white">
        <GoodsList ref="goodsListRef" />
      </view>
    </template>

    <template #popup>
      <Login @loginSuccess="loginSuccess" />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import GoodsList from '@/components/GoodsList.vue';
import { computed, ref } from 'vue';
import { iconLoaded } from '@iconify/vue';
import Login from '@/components/Login/index.vue'
import { useUserStore } from '@/stores';
import type { UserTypes } from 'types/server';

const layoutRef = ref<InstanceType<typeof Layout>>()
const goodsListRef = ref<InstanceType<typeof GoodsList>>()
const userStore = useUserStore()


function bodyScrollToLower(e: any) {
  console.log('mine到底了', e)
  goodsListRef.value?.lowerBottom(e)
}

const orderItems = ref([
  {
    icon: "icon-order",
    label: '全部订单',
  },
  {
    icon: "icon-pay",
    label: '待付款',
  },
  {
    icon: "icon-share1",
    label: '拼团中',
  },
  {
    icon: "icon-time",
    label: '打包中',
  },
  {
    icon: "icon-31daishouhuo",
    label: '待收货',
  },
  {
    icon: "icon-pingjia",
    label: '评价',
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
    label: "收货地址",
    click: () => {
      uni.navigateTo({
        url: '/pages/address/index'
      })
    }
  },
  {
    icon: 'icon-guanfangkefu',
    label: "官方客服",
    click: () => { }
  },
  {
    icon: 'icon-shezhi',
    label: "设置",
    click: () => {
      uni.navigateTo({
        url: '/pages/setting/index'
      })
    }
  },
])

const userInfo = computed<UserTypes | null>(() => {
  return userStore.userInfo as UserTypes
})

function toOrder(item: any, index: number) {
  uni.navigateTo({
    url: `/pages/order/index?type=${index}`
  })
}

function loginClick() {
  // layoutRef.value?.openPopup()
  uni.navigateTo({
    url: '/pages/login/index'
  })
}

function loginSuccess() {
  layoutRef.value?.closePopup()
}

</script>

<style scoped></style>