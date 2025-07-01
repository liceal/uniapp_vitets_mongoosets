<script setup lang='ts'>
import expresses from '@/api/expresses';
import GoodsList from '@/components/GoodsList.vue';
import Layout from '@/components/layout/index.vue'
import { copy } from '@/utils';
import { onLoad } from '@dcloudio/uni-app';
import type { MapTypes } from 'shims-uni';
import type { ExpressLogTypes, ExpressTypes } from 'types/server';
import { computed, ref } from 'vue';

// 地图
// const mapAttrs = computed<MapTypes>(() => {
//   return {
//     latitude: 39.909,
//     longitude: 116.39742,
//     covers: [
//       {
//         latitude: 39.909,
//         longitude: 116.39742,
//         iconPath: '../../../static/location.png'
//       },
//       {
//         latitude: 39.90,
//         longitude: 116.39,
//         iconPath: '../../../static/location.png'
//       }
//     ]
//   }
// })


const logExpand = ref(false)
const logList = computed<ExpressLogTypes[]>(() => {
  if (logExpand.value) {
    return express.value?.express_logs || []
  } else {
    if (express.value?.express_logs?.length) {
      return [express.value?.express_logs[0]]
    }
    return []
  }
})

const order_id = ref('')
onLoad((options) => {
  order_id.value = options?.order_id || ''
  getExpress()
})

const express = ref<ExpressTypes>()
function getExpress() {
  expresses.findOne
    .post({
      order_id: order_id.value
    })
    .then(res => {
      express.value = res
    })
}

</script>

<template>
  <Layout isCustomNavBar topVirtual topVirtualTitle="待取件">
    <template #body>
      <view class="h-20vh">
        <!-- <map v-bind="mapAttrs" /> -->
        地图功能
      </view>

      <!-- 取件码 -->
      <view class="bg-white mb-2 p-2" v-if="express?.pickup_code">
        <view class="flex">
          <view class="text-green-5 text-xl flex-1">取件码 <text class="font-bold">{{ express?.pickup_code }}</text></view>
          <u-button size="mini" @click="() => copy(express?.pickup_code)">复制</u-button>
        </view>
        <view class="flex">
          <view class="flex-1">{{ express?.collect }} | <text class="text-gray-4">{{ express?.address }}</text></view>
          <u-button size="mini">拨打电话</u-button>
        </view>
      </view>

      <view class=" bg-white">
        <!-- 快递 -->
        <view class="flex py-2 items-center">
          <u-image
            src="https://img-3.pddpic.com/garner-api-new/8b60a95aca982f998eba3ff449d600a1.jpeg?imageView2/2/w/1300/q/80"
            height="1.5rem" width="1.5rem" class="px-2" />
          <view class="flex-1">
            <text class="text-green-5">{{ express?.express_name }}</text>:
            {{ express?.express_code }}
          </view>
          <view class="px-2">
            <u-button size="mini" @click="() => copy(express?.express_code)">复制</u-button>
          </view>
        </view>
        <!-- 快递员 -->
        <view class="py-2 flex border-top-ef items-center">
          <u-icon name="account" size="40" class="text-gray px-2" />
          <view class="flex-1">{{ express?.express_name }}派件员</view>
          <view class="px-2">
            <u-button size="mini">拨打电话</u-button>
          </view>
        </view>
        <!-- 订单信息 -->
        <view class="py-2 flex border-top-ef items-center">
          <u-icon name="car" size="40" class="text-gray px-2" />
          <view class="flex-1">
            <view class="flex">
              <view class="line-clamp-1 flex-1">
                订单编号：{{ express?.order_id }}
              </view>
              <view class="px-2">
                <u-button size="mini">复制</u-button>
              </view>
            </view>
            <view>
              收货地址：{{ express?.receive_addr }}
            </view>
          </view>
        </view>
        <!-- 物流 -->
        <view class="pl-5 border-top-ef py-2">
          <u-time-line>
            <u-time-line-item v-for="item in logList" :key="item">
              <template #node>
                <view class="bg-green-5">
                  <!-- 此处为uView的icon组件 -->
                  <u-icon name="map" color="#fff" :size="40"></u-icon>
                </view>
              </template>
              <template #content>
                <view>
                  <view class="u-order-title">
                    <text :class="{ 'text-green-5': item.status == 1 }">{{ item.status_name }}</text>
                    <text class="text-xs text-gray pl-1">{{ item.createdAt }}</text>
                  </view>
                  <view class="text-xs text-gray">{{ item.remark }}</view>
                </view>
              </template>
            </u-time-line-item>
          </u-time-line>
          <view class="text-center text-xs" @click="logExpand = !logExpand">
            <template v-if="logExpand">
              收起<u-icon name="arrow-up" class="pl-2 text-gray" />
            </template>
            <template v-else>
              展开<u-icon name="arrow-down" class="pl-2 text-gray" />
            </template>
          </view>
        </view>
      </view>
      <GoodsList />
    </template>
  </Layout>
</template>

<style lang='scss' scoped></style>