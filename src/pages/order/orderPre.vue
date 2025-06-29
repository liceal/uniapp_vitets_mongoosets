<!-- 预下单 -->
<template>
  <Layout is-custom-nav-bar>
    <template #header>
      <Header class="bg-white" />
    </template>
    <template #body>
      <!-- 用户地址 -->
      <view class="flex justify-center items-center bg-white p-2 gap-2">
        <u-icon name="map" class="text-gray" size="40" />
        <view class="flex-1">
          <view class="py-1">
            <text class="font-bold text-xl">{{ addressDefault?.username }}</text>
            <text>{{ addressDefault?.phone }}</text>
          </view>
          <view class="line-clamp-2">
            <Tag v-if="goodsInfo?.noReason7d">七天无理由退货</Tag>
            {{ addressDefault?.address_full }}
          </view>
        </view>
        <u-icon name="arrow-right" class="text-gray" size="40" />
      </view>

      <!-- 商品部分 -->
      <view class="bg-white mt-2 py-1 px-2">
        <view class="flex items-center gap-1">
          <u-avatar :src="goodsInfo?.shopDetail?.pictureUrl" size="50" />
          <view class="line-clamp-1">{{ goodsInfo?.shopDetail?.name }}</view>
          <u-icon name="arrow-right" class="text-gray" />
        </view>
        <!-- 商品 -->
        <view class="flex gap2 pb-4">
          <u-image width="6em" height="6em" mode="aspectFit"
            src="https://img.pddpic.com/gaudit-image/2025-03-11/924d53c675061bdcc7722c0ce56bb7df.jpeg" />
          <view class="flex-1 flex flex-col">
            <view class="line-clamp-2">
              {{ goodsInfo?.name }}
            </view>
            <view class="line-clamp-2 text-gray" v-for="(value, key) in skuInfo?.attr" :key="key">
              {{ key }}：{{ value }}
            </view>
            <view class="text-red-6">
              限时低价
              <Price :price="skuInfo?.price" />
            </view>
            <u-number-box v-model="number" />
          </view>
        </view>

        <!-- 优惠 -->
        <view v-for="item in 3" :key="item" class="border-top-ef flex justify-between items-center py-2">
          <text>免费服务</text>
          <view>
            <text class="text-green-5">
              <u-icon name="integral-fill" size="30" />
              退货包运费
            </text>
            <text class="text-gray">(商家赠送)</text>
          </view>
        </view>
      </view>

      <!-- 支付 -->
      <view class="px-2 mt-2 bg-white">
        <view class="flex items-center gap-1"></view>
        <view class="flex justify-between items-center gap-1 py-2 ">
          <view class="flex items-center line-clamp-1">
            <u-icon size="50" name="weixin-fill" /> 微信支付
          </view>
          <!-- <u-icon name="checkmark" size="30" class="text-gray" /> -->
        </view>
        <view class="flex justify-between items-center gap-1 py-2 border-top-ef">
          <view class="flex items-center line-clamp-1">
            <u-icon size="50" name="rmb-circle-fill" /> 先用后付
            <text class="text-gray">（0元下单，确认收款后付款）</text>
          </view>
          <u-icon name="checkmark" size="30" class="text-gray" />
        </view>
        <view class="flex justify-between items-center gap-1 py-2 border-top-ef">
          <view class="flex items-center line-clamp-1">
            <u-icon size="50" name="zhifubao" /> 支付宝
          </view>
          <!-- <u-icon name="checkmark" size="30" class="text-gray" /> -->
        </view>
      </view>


    </template>
    <template #footer>
      <FooterPay :price_actual="11.23" :price_receive="22.12" @pay-click="payClick" />
    </template>
  </Layout>
</template>

<script setup lang='ts'>
import Tag from '@/components/Tag.vue';
import { onLoad } from '@dcloudio/uni-app';
import Layout from '@/components/layout/index.vue'
import Price from '@/components/Price.vue';
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import FooterPay from '@/components/FooterPay.vue';
import goods from '@/api/goods';
import skus from '@/api/skus';
import type { AddressesTypes, GoodsTypes } from 'types/server';
import type { SkuTypes } from 'types/sku';
import addresses from '@/api/addresses';
import order from '@/api/order';

const goods_id = ref<string>()
const sku_id = ref<string>()
const goodsInfo = ref<GoodsTypes>()
const skuInfo = ref<SkuTypes>()


onLoad((options) => {
  goods_id.value = options?.goods_id
  sku_id.value = options?.sku_id
  init()
  getAddressDefault()
})

const number = ref(1)

function init() {
  // 获取商品信息和规格信息
  if (goods_id.value) {
    goods.goods.get(goods_id.value)
      .then(res => {
        goodsInfo.value = res
      })
  }
  if (sku_id.value) {
    skus.sku.get(sku_id.value)
      .then(res => {
        skuInfo.value = res
      })
  }
}

const addressDefault = ref<AddressesTypes>()
function getAddressDefault() {
  addresses.default.post().then(res => {
    addressDefault.value = res
  })
}

// 购买生成订单
function payClick() {
  order.CRUD.post({
    goodsId: goods_id.value,
    addressId: addressDefault.value?._id,
    number: number.value
  }).then(res => {
    console.log('订单创建成功，跳到订单详情页');
    uni.navigateTo({
      url: '/pages/order/orderDetail?id=' + res.id
    })
  })
}

</script>

<style lang='scss' scoped></style>