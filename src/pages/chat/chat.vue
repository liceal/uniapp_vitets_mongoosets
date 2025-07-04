<script setup lang='ts'>
import chat_room from '@/api/chat_room'
import Layout from '@/components/layout/index.vue'
import { useUserStore } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'
import moment from 'moment'
import type { ChatMessageTypes, ChatRoomTypes, UserTypes } from 'types/server'
import { onMounted, ref, watch } from 'vue'

const chatTitle = ref('')
const chatRoomDetail = ref<ChatRoomTypes>()
const userStore = useUserStore()
const message = ref('')
const showHandle = ref(false)

onLoad((options) => {
  let { chat_room_id } = options as { chat_room_id: string }
  if (chat_room_id) {
    chat_room.crud
      .get(chat_room_id)
      .then(res => {
        chatRoomDetail.value = res
        chatTitle.value = res.title

        // 连接ws
        // 如果登录了 则连接ws
        const userInfo = userStore.getUserInfo()
        if (userInfo) {
          connectWs(userInfo)
        }
      })
  }
})

// 监听 chatTitle 的变化，当值改变时更新标题
watch(chatTitle,
  (newTitle) => {
    uni.setNavigationBarTitle({
      title: newTitle
    })
  },
  {
    immediate: true
  }
)

// 按加号更多功能
function clickShowHandle() {
  showHandle.value = !showHandle.value
}

// 发送消息
function msgSend(e: any) {
  uni.showToast({
    title: message.value
  })
  console.log(e);
  // chatRoomDetail.value?.messages.push({
  //   message: message.value,
  //   user_id: userStore.userInfo?._id,
  //   createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
  // })

  socket?.send({
    data: message.value
  })

  uni.showLoading()
}

function bodyClick(e: any) {
  showHandle.value = false
}

// socket连接
let socket: UniApp.SocketTask | null = null
// let socket = ref()
// 测试连接websocket
function connectWs(userInfo: UserTypes) {

  let path = import.meta.env.VITE_WS_PROXY_PATH
  socket = uni.connectSocket({
    url: `${path}/?user_id=${userInfo._id}&room_id=${chatRoomDetail.value?._id}`,
    success: () => { console.log('正在连接'); },
    fail: (err) => { console.error('连接失败', err); },
    complete: (e) => {
      console.log(e);
    }
  })

  socket.onOpen(() => {
    console.log('连接成功');
  })

  socket.onClose(() => {
    console.log('连接关闭');
  })

  socket.onMessage((e: { data: string }) => {
    uni.hideLoading()
    console.log('收到消息', e);
    if (e.data === '__SendSuccess__') {
      // 发送信息成功的回调
      uni.showToast({
        title: "消息发送成功"
      })

      chatRoomDetail.value?.messages.push({
        message: message.value,
        user_id: userStore.userInfo?._id,
        user_detail: userStore.userInfo,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),

      })
      message.value = ''
    } else {
      // 否则是json数据 进行解析
      let data = JSON.parse(e.data) as { type: 'success' | 'error', message: string, user_id: string, user_detail: UserTypes }
      console.log(data);
      if (data.type === 'error') {
        uni.showToast({
          icon: 'error',
          title: data.message
        })
      } else if (data.type === 'success') {
        uni.showToast({
          icon: 'success',
          title: data.message
        })
      } else if (data.type === 'receive') {
        // 收到对方消息
        chatRoomDetail.value?.messages.push({
          message: data.message,
          user_id: data.user_id,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          user_detail: data.user_detail
        })
      }
    }
  })
}

// 判断是本人消息还是对方消息，判断userid是不是自己
// function isMyMsg(item: ChatMessageTypes) {
//   return item.user_id === userStore.userInfo?._id
// }

// 判断信息在左侧还是右侧，我的信息在左侧 对方的信息在右侧
function isMe(item: ChatMessageTypes) {
  // 如果自己是商户 则商户信息在右侧
  return userStore.userInfo._id === item.user_id
}
</script>

<template>
  <Layout @body-click="bodyClick">
    <template #body>
      <view class="flex flex-col gap-4 pt-4">

        <template v-for="(item, k) in chatRoomDetail?.messages" :key="k">
          <!-- <view v-if="item.type === 'time'" class="text-gray text-xs py-2 text-center">
            {{ item.createdAt }}
          </view> -->
          <!-- 商户在左侧 -->
          <template v-if="!isMe(item)">
            <view class="flex">
              <u-image :src="item.user_detail?.avatar" height="3rem" width="3rem" class="px-2" />
              <view class="flex-1 border-rounded mr-5rem arrow-left">
                <view>
                  {{ item.user_detail?.username }}
                </view>
                <view class="bg-white p-2">
                  {{ item.message }}
                </view>
              </view>
            </view>
          </template>

          <!-- 用户在右侧 -->
          <template v-else>
            <view class="flex">
              <view class="flex-1 border-rounded ml-5rem arrow-right text-right">
                <view>
                  {{ item.user_detail?.username }}
                </view>
                <view class="bg-white p-2">
                  {{ item.message }}
                </view>
              </view>
              <u-image :src="item.user_detail?.avatar" height="3rem" width="3rem" class="px-2" />
            </view>
          </template>
        </template>

        <!-- 占位 -->
        <view class="h-4rem" />
      </view>
    </template>
    <template #footer>
      <view class="border-top-ef p-2 bg-gray-1 flex gap-2 flex items-center justify-center w-full box-border">
        <u-input placeholder="" confirm-type="send" @confirm="msgSend" v-model="message"
          class="bg-white flex-1 !px-2" />
        <u-icon name="plus-circle" size="55" class="text-gray" @click="clickShowHandle" />
      </view>
      <view class="overflow-hidden" :style="{
        height: showHandle ? '450rpx' : '0',
        transition: 'height 0.3s ease-in-out',
        opacity: showHandle ? 1 : 0,
        'transition-property': 'height, opacity'
      }">
        <view class="grid grid-cols-4 gap-4 px-4 py-2 bg-gray-1 overflow-hidden h-450rpx box-border">
          <view class="box-border flex flex-col justify-center items-center gap-1 active:opacity-70" v-for="item in 7">
            <u-icon name="file-text-fill" size="60" class="p-4 bg-white border-rounded text-gray-6" />
            <text class="text-gray-6">订单</text>
          </view>
        </view>
      </view>
    </template>
  </Layout>
</template>


<style lang='scss' scoped>
/* 添加左箭头样式 */
.arrow-left {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 1.4rem;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-right: 8px solid white;
    border-bottom: 8px solid transparent;
  }
}

/* 添加右箭头样式 */
.arrow-right {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 10px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-left: 8px solid white;
    border-bottom: 8px solid transparent;
  }
}
</style>