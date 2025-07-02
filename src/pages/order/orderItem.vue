<template>
  <view class="py-1">
    <!-- 商家 -->
    <view class="flex justify-between items-center px-1">
      <view class="flex gap-1 items-center">
        <u-image mode="aspectFill" :src="props.shopImgUrl" height="1.5rem" width="1.5rem" />
        <text>{{ props.shopName }}</text>
        <u-icon name="arrow-right" class="text-gray-4" />
      </view>
      <text class="text-red-5">
        {{ props.statusName }}
      </text>
    </view>

    <!-- 商品 -->
    <view class="mt-2 flex justify-evenly border-b-gray-1 border-b-solid border-b-1 gap-1 pb-1 px-1" @click="toDetail">
      <u-image mode="aspectFill" :src="props.goodsImgUrl" width="5rem" height="5rem" />
      <view class="flex flex-col justify-evenly flex-1">
        <text class="line-clamp-2 text-sm">{{ props.goodsName }}</text>
        <text class="line-clamp-1 text-xs text-gray">{{ props.goodsSkuStr }}</text>
        <view class="flex gap-1 text-xs">
          <Tag v-if="props.shippingFee">退货包运费保障中</Tag>
          <Tag v-if="props.shippingFee">7天无理由退货</Tag>
        </view>
      </view>
      <view class="text-right pl-2">
        <view>
          <text class="text-0.6rem">￥</text>
          <text>{{ props.goodsUnitPrice }}</text>
        </view>
        <view class="text-gray">
          x{{ props.goodsNumber }}
        </view>
      </view>
    </view>

    <!-- 付款 -->
    <view class="p-1 border-b-gray-1 border-b-solid border-b-1 ">
      <view class="text-right text-xs">
        <view v-if="props.useFirst">先用后付 实付:<text class="text-0.6rem">￥</text>0</view>
        <view>(确认收获后自动付款￥{{ props.goodsTotalPrice }})</view>
      </view>
    </view>

    <!-- 操作 -->
    <view class="flex justify-end items-center p-1 gap-1">
      <text class="mr-2">更多</text>
      <u-button class="m-0" type="info">申请售后</u-button>
      <u-button class="m-0" type="info" @click="clickLogistics">查看物流</u-button>
      <u-button class="m-0" type="primary">确认收货</u-button>
    </view>

    <!-- 物流 -->
    <view class="rounded text-gray-4 bg-gray-1 flex gap-1 m-1 p-1 px-2">
      <u-icon name="car" />
      <text>
        商家已发货，正在通知中通快递取件
      </text>
    </view>
  </view>
</template>

<script setup lang='ts'>
import type { OrderTypes } from 'types/server';
import Tag from '@/components/Tag.vue';

const emits = defineEmits(['clickLogistics'])

const props = defineProps<OrderTypes>()


function toDetail() {
  uni.navigateTo({
    url: `/pages/order/orderDetail?id=${props.id}`
  })
}

function clickLogistics() {
  emits('clickLogistics')
}
</script>

<style lang='scss' scoped></style>