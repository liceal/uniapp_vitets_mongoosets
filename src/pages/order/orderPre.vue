<!-- 预下单 -->
<template>
  <Layout is-custom-nav-bar>
    <template #header>
      <Header class="bg-white" />
    </template>
    <template #body>
      <!-- 用户地址 -->
      <view class="flex justify-center items-center bg-white">
        <u-icon name="map" class="p-2 text-gray" size="40" />
        <view>
          <view class="py-1">
            <text class="font-bold text-xl">林晓</text>
            <text>132****4776</text>
          </view>
          <view class="line-clamp-2">
            <Tag>七天无理由退货</Tag>
            浙江省 杭州市 钱塘区 云水苑2幢611云水苑2幢611云水苑2幢611云水苑2幢611苑2幢611云水苑2幢611
          </view>
        </view>
        <u-icon name="arrow-right" class="p-2 text-gray" size="40" />
      </view>

      <!-- 商品部分 -->
      <view class="bg-white mt-2 py-1 px-2">
        <view class="flex items-center gap-1">
          <u-avatar src="https://img.pddpic.com/gaudit-image/2025-03-11/924d53c675061bdcc7722c0ce56bb7df.jpeg"
            size="50" />
          <view class="line-clamp-1">店铺名称店铺名称店铺名称店铺名称</view>
          <u-icon name="arrow-right" class="text-gray" />
        </view>
        <!-- 商品 -->
        <view class="flex gap-2 pb-4">
          <u-image width="6em" height="6em" mode="aspectFit"
            src="https://img.pddpic.com/gaudit-image/2025-03-11/924d53c675061bdcc7722c0ce56bb7df.jpeg" />
          <view class="flex-1 flex flex-col gap-1">
            <view class="line-clamp-2">商品名称啊商品名称啊商品名称啊商品名称啊商品名称啊商品名称啊商品名称啊商品名称啊商品名称啊商品名称啊商品名称啊商品名称啊商品名称啊商品名称啊商品名称啊
            </view>
            <view class="line-clamp-2 text-gray">
              商品规格啊【白色】商品规格啊【白色】商品规格啊【白色】商品规格啊【白色】商品规格啊【白色】商品规格啊【白色】商品规格啊【白色】商品规格啊【白色】商品规格啊【白色】商品规格啊【白色】
            </view>
            <view class="text-red-6">
              限时低价
              <Price :price="5.77" />
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
      <FooterPay :price_actual="11.23" :price_receive="22.12" />
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
onLoad((options) => {
  console.log(options);
})

const number = ref(1)
</script>

<style lang='scss' scoped></style>