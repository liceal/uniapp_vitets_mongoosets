<template>
  <Layout>
    <template #header>
      <view class="relative text-center bg-white h-2rem flex justify-center items-center text-1.2rem">
        <u-icon name="arrow-left" class="absolute left-0 text-gray" size="50" @click="back" />
        <text>
          待付款
        </text>
      </view>
    </template>
    <template #body>
      <view>
        <!-- 地址信息 -->
        <view class="bg-white">
          <view class="text-red-5 text-xs flex justify-center">
            请在
            <u-count-down :timestamp="24 * 3600 * 1000" format="HH:mm:ss.SSS"></u-count-down>
            内支付，逾期订单将自动取消
          </view>
          <view class="border-top-ef flex justify-center items-center gap-1 p-2">
            <u-icon name="map" class="text-red" size="60" />
            <view class="flex-1">
              <view class="line-clamp-1">
                林晓
                <text>132****4776<u-icon name="eye" /></text>
                杭州杭州杭州杭州杭州杭州杭州杭州杭州杭州杭州杭州
              </view>
              <view>
                云水苑2幢611
              </view>
            </view>
            <u-button size="mini" type="primary" plain>修改</u-button>
          </view>
        </view>

        <!-- 商品信息 -->
        <OrderGoods class="mt-2" />

        <!-- 支付方式 -->
        <view class="p-2 mt-2 bg-white">
          <view class="flex items-center gap-1 py-2"><u-icon size="50" name="weixin-fill" /> 微信支付</view>
          <view class="flex items-center gap-1 py-2 border-top-ef"><u-icon size="50" name="rmb-circle-fill" /> 微信支付
          </view>
          <view class="flex items-center gap-1 py-2 border-top-ef"><u-icon size="50" name="zhifubao" /> 支付宝</view>
        </view>

        <view class="p-2 mt-2 bg-white">
          <view>消费提醒</view>
          <view class="text-xs text-gray-4">
            买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买买
          </view>
        </view>

        <view class="p-2 mt-2 text-gray bg-white">
          <view class="flex justify-between">订单编号：13213131321321321321
            <u-button size="mini" plain class="!m-0">复制</u-button>
          </view>
          <view>下单实际：2025-06-20 16:06:14</view>
        </view>
      </view>
    </template>
    <template #footer>
      <FooterPay :price_receive="19.13" />
    </template>
  </Layout>
</template>

<script setup lang='ts'>
import Layout from '@/components/layout/index.vue'
import OrderGoods from './orderGoods.vue';
import { back } from '@/utils';
import FooterPay from '@/components/FooterPay.vue';
</script>

<style lang='scss' scoped></style>