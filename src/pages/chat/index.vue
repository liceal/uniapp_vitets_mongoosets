<script setup lang='ts'>
import Layout from '@/components/layout/index.vue'

function toChat() {
  uni.navigateTo({
    url: '/pages/chat/chat'
  })
}

</script>

<template>
  <Layout showTabbar :bgGray="false">
    <template #body>
      <view v-for="item in 20" :key="item" class="flex border-top-ef p-2 items-center gap-1 active:bg-gray-1"
        @click="toChat">
        <u-image src="https://img.pddpic.com/gaudit-image/2025-03-11/924d53c675061bdcc7722c0ce56bb7df.jpeg"
          height="3.5rem" width="3.5rem" class="border-rounded" />
        <view class="flex-1">
          <view class="flex">
            <view class="flex-1 text-lg">店铺名称</view>
            <view class="text-gray">25/06/06</view>
          </view>
          <view class="flex items-center">
            <view class="flex-1 line-clamp-1 text-gray">
              最新的一个消息最新的一个消息最新的一个消息
            </view>
            <view class="border-rounded-full w-1rem h-1rem text-xs text-white bg-red-6 text-center">5</view>
          </view>
        </view>
      </view>
    </template>
  </Layout>
</template>

<style lang='scss' scoped></style>