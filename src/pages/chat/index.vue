<script setup lang='ts'>
import chat_room from '@/api/chat_room';
import Layout from '@/components/layout/index.vue'
import { onShow } from '@dcloudio/uni-app';
import type { ChatRoomTypes } from 'types/server';
import { onMounted, ref } from 'vue';

onShow(() => {
  getChatRooms()
})

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

// 长按行 呼出功能弹窗
function handleLongPress(e: any, item: ChatRoomTypes) {
  console.log(e, item);
  e.stopPropagation()
}

function actionItemClick(e: { position: 'left' | 'right', index: number, content: { text: string, style: any } }, item: ChatRoomTypes) {
  console.log(e);
  if (e.position === 'right') {
    if (e.content.text === '删除') {
      uni.showModal({
        title: '提示',
        content: '确定删除该聊天室吗？',
        success: (res) => {
          if (res.confirm) {

            chat_room.crud
              .delete(item._id)
              .then(res => {
                getChatRooms()
              })
          }
        }
      })
    }
  }
}
</script>

<template>
  <Layout showTabbar :bgGray="false">
    <template #body>
      <uni-swipe-action>

        <uni-swipe-action-item v-for="item in chatRooms" :key="item._id"
          :right-options="[{ text: '删除', style: { backgroundColor: 'red' } }]"
          @click="(e: any) => actionItemClick(e, item)">

          <view class="flex border-top-ef p-2 items-center gap-1 active:bg-gray-1" @click="() => toChat(item)"
            @longpress="(e: any) => handleLongPress(e, item)" :threshold="0">

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
                <view class="border-rounded-full w-1rem h-1rem text-xs text-white bg-red-6 text-center">
                  {{ item.messages.length }}
                </view>
              </view>
            </view>

          </view>

          <!-- <template #right>
            <view class="bg-red-6 active:bg-red-4 p-4 text-white flex items-center text-lg">删除</view>
          </template> -->

        </uni-swipe-action-item>
      </uni-swipe-action>

      <!-- 弹窗 -->
      <!-- <view class="absolute bg-white w-5rem shadow-md" :style="{ top: '130px', left: '78px' }">
        <view class="px-4 py-2 active:bg-gray-1">删除</view>
      </view> -->
    </template>
  </Layout>
</template>

<style lang='scss' scoped></style>