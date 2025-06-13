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
    <view class="mt-2 flex justify-evenly border-b-gray-1 border-b-solid border-b-1 gap-1 pb-1 px-1">
      <u-image mode="aspectFill" :src="props.goodsImgUrl" width="5rem" height="5rem" />
      <view class="flex flex-col justify-evenly flex-1">
        <text class="line-clamp-2 text-sm">{{ props.goodsName }}</text>
        <text class="line-clamp-1 text-xs text-gray">{{ props.goodsSkuStr }}</text>
        <view class="flex gap-1 text-xs">
          <view class="text-white bg-green-6 px-1" v-if="props.shippingFee">退货包运费保障中</view>
          <view class="text-white bg-green-6 px-1" v-if="props.noReason7d">7天无理由退货</view>
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
      <text>更多</text>
      <u-button class="m-0" size="mini" type="info">申请售后</u-button>
      <u-button class="m-0" size="mini" type="info">查看物流</u-button>
      <u-button class="m-0" size="mini" type="primary">确认收获</u-button>
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

const props = defineProps<OrderTypes>()

</script>

<style lang='scss' scoped></style>