<template>
  <Layout ref="layout" isCustomNavBar top-safe>
    <template #header>
      <view class="relative text-center bg-white h-2rem flex justify-center items-center text-1.2rem">
        <u-icon name="arrow-left" class="absolute left-0 text-gray" size="50"
          @click="() => back('/pages/order/index')" />
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
                {{ orderInfo?.address.username }}
                <text>{{ phoneVisible ? orderInfo?.address.phone : '***********' }}<u-icon
                    :name="phoneVisible ? 'eye-off' : 'eye'" @click="() => phoneVisible = !phoneVisible" /></text>
                {{ orderInfo?.address.address_full }}
              </view>
              <view>
                {{ orderInfo?.address.address }}
              </view>
            </view>
            <u-button size="mini" type="primary" plain ripple @click="editAddress">修改</u-button>
          </view>
        </view>

        <!-- 商品信息 -->
        <OrderGoods class="mt-2" :order="orderInfo" />

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
          <view class="flex justify-between">订单编号：{{ orderInfo?.id }}
            <u-button size="mini" plain class="!m-0" @click="() => copy(orderInfo?.id)">复制</u-button>
          </view>
          <view>下单时间：{{ orderInfo?.createdAt }}</view>
        </view>
      </view>
    </template>
    <template #footer>
      <FooterPay :price_actual="orderInfo?.goodsTotalPrice" :price_receive="orderInfo?.goodsTotalPrice" />
    </template>
    <template #popup>
      <Address @itemClick="addressItemClick" />
    </template>
  </Layout>
</template>

<script setup lang='ts'>
import Layout from '@/components/layout/index.vue'
import OrderGoods from './orderGoods.vue';
import { back, copy } from '@/utils';
import FooterPay from '@/components/FooterPay.vue';
import order from '@/api/order';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { onMounted, ref } from 'vue';
import type { AddressesTypes, OrderTypes } from 'types/server';
import Address from '@/pages/address/index.vue'

let phoneVisible = ref(true)

let order_id = ref()
onLoad((options) => {
  console.log('orderDetail onload', options);
  order_id.value = options?.id || ''
  getOrderInfo()

})

onShow((options) => {
  console.log('orderDetail onshow', options);
  // 每次进来重新
})

const orderInfo = ref<OrderTypes>()
function getOrderInfo() {
  order.CRUD.get({
    id: order_id.value,
  }).then(res => {
    orderInfo.value = res
  })
}

const layout = ref<InstanceType<typeof Layout>>();
// 编辑地址
function editAddress() {
  layout.value?.openPopup();
}

// 点击了某个地址
function addressItemClick(item: AddressesTypes) {
  // 回写数据
  if (orderInfo.value) {
    layout.value?.closePopup();
    orderInfo.value.address = item
  }
}
</script>

<style lang='scss' scoped></style>