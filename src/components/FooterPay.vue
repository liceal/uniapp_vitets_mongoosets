<template>
  <view class="flex gap-2">
    <view class="flex-1 text-end">
      <view>
        实付款
        <Price :price="props.price_actual" />
      </view>
      <view class="text-red-6">
        <text class="font-bold">确认收货后付款</text>
        <Price :price="props.price_receive" />
      </view>
    </view>
    <view class="bg-red-6 text-white w-7rem flex justify-center items-center text-1.5em active:bg-red-5">
      去支付
    </view>
  </view>
</template>

<script setup lang='ts'>
import Price from './Price.vue';

const props = defineProps({
  price_actual: {
    type: Number,
    default: 0
  },
  price_receive: {
    type: Number,
    default: 0
  }
})
</script>

<style lang='scss' scoped></style>