<template>
  <view class="bg-white p-2 flex flex-col">
    <view class="flex items-center gap-1">
      <u-avatar :src="props.order?.shopImgUrl" size="50" />
      <text class="line-clamp-1 max-w-40vw">{{ props.order?.shopName }}</text>
      <u-icon name="arrow-right" class="text-gray" />
    </view>

    <!-- 商品 -->
    <view>
      <view class="flex pt-2 gap-1">
        <u-image width="7rem" height="7rem" mode="aspectFit" :src="props.order?.goodsImgUrl" />
        <view class="flex-1">
          <view class="flex">
            <view class="flex-1 flex flex-col justify-between">
              <view class="line-clamp-2 text-1.1em">
                {{ props.order?.goodsName }}
              </view>
              <view class=" text-gray">
                {{ props.order?.goodsSkuStr }}
              </view>
            </view>

            <view class="pl-2 text-end">
              <view>￥{{ props.order?.goodsUnitPrice }}</view>
              <view class="text-gray">x{{ props.order?.goodsNumber }}</view>
            </view>
          </view>

          <view class="flex gap-1">
            <view class="bg-#24b613 text-white px-1" v-if="props.order?.shippingFee">退货包运费</view>
            <view class="bg-#24b613 text-white px-1" v-if="props.order?.noReason7d">7天无理由退货</view>
          </view>
        </view>
      </view>
      <view class="mt-2">
        <view class="btn-info active:bg-gray-1" @click="linkShop">
          <u-icon name="chat" class="text-#24b613" size="40" />联系商家
        </view>
      </view>
      <view class="border-top-ef text-end">
        应付:<text class="text-xs text-red-5">￥</text><text class="text-lg text-red-5">
          {{ props.order?.goodsTotalPrice }}</text>
        {{ props.order?.shippingFee && '(免运费)' }}
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>
import type { OrderTypes } from 'types/server';

const props = defineProps<{
  order: OrderTypes | undefined
}>()

function linkShop() {
  console.log('联系商家');
}
</script>

<style lang='scss' scoped></style>