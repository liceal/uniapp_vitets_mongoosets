<template>
  <Layout>
    <template #body>

      <!-- 登录 用户 -->
      <view class="p-2">
        <u-button type="primary">登录</u-button>
      </view>

      <!-- 订单 -->
      <view class="grid grid-cols-3 gap-2 border-top-ef">
        <view v-for="item in 6" :key="item" class="flex flex-col justify-center items-center h-[5rem] gap-2">
          <u-icon name="order" size="60" />
          <text>全部订单</text>
        </view>
      </view>

      <!-- 商品 -->
      <view class="grid grid-cols-3 gap-2 border-top-ef">
        <view v-for="item in 6" :key="item" class="flex flex-col justify-center items-center h-[5rem] gap-2">
          <u-icon name="coupon-fill" size="60" class="text-red-6" />
          <text>优惠券</text>
        </view>
      </view>

      <!-- 功能 -->
      <view class="grid grid-cols-3 gap-2 border-top-ef">
        <view v-for="item in 6" :key="item" class="flex flex-col justify-center items-center h-[5rem]">
          <u-icon name="map" size="60" class="text-orange-4" />
          <text>收货地址</text>
        </view>
      </view>

      <!-- 推荐商品 -->
      <GoodsList class="border-top-ef" />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import GoodsList from '@/components/GoodsList.vue';

</script>

<style scoped></style>