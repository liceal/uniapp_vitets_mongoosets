<script setup lang='ts'>
import chat_room from '@/api/chat_room';
import Layout from '@/components/layout/index.vue'
import type { ChatRoomTypes } from 'types/server';
import { onMounted, ref } from 'vue';

const chatRooms = ref<ChatRoomTypes[]>()

function toChat(item: ChatRoomTypes) {
  uni.navigateTo({
    url: `/pages/chat/chat?chat_room_id=${item._id}`
  })
}

function getChatRooms() {
  chat_room.list
    .post()
    .then(res => {
      chatRooms.value = res
    })
}

onMounted(() => {
  getChatRooms()
})

</script>

<template>
  <Layout showTabbar :bgGray="false">
    <template #body>
      <view v-for="item in chatRooms" :key="item._id" class="flex border-top-ef p-2 items-center gap-1 active:bg-gray-1"
        @click="() => toChat(item)">
        <u-image src="https://img.pddpic.com/gaudit-image/2025-03-11/924d53c675061bdcc7722c0ce56bb7df.jpeg"
          height="3.5rem" width="3.5rem" class="border-rounded" />
        <view class="flex-1">
          <view class="flex">
            <view class="flex-1 text-lg">{{ item.title }}</view>
            <view class="text-gray">{{ item.createdAt }}</view>
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