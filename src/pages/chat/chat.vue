<script setup lang='ts'>
import chat_room from '@/api/chat_room'
import Layout from '@/components/layout/index.vue'
import { useUserStore } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'
import moment from 'moment'
import type { ChatMessageTypes, ChatRoomTypes, UserTypes } from 'types/server'
import { onMounted, ref, watch } from 'vue'

const chatTitle = ref('初始聊天室标题')
const chatRoomDetail = ref<ChatRoomTypes>()
const userStore = useUserStore()

onLoad((options) => {
  let { chat_room_id } = options as { chat_room_id: string }
  if (chat_room_id) {
    chat_room.crud
      .get(chat_room_id)
      .then(res => {
        chatRoomDetail.value = res

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

// 模拟在某个操作后更改标题
const changeTitle = () => {
  chatTitle.value = '更改后的聊天室标题'
}

const showHandle = ref(false)
function clickShowHandle() {
  showHandle.value = !showHandle.value
}

const message = ref('')
function msgSend(e: any) {
  uni.showToast({
    title: message.value
  })
  console.log(e);
  chatRoomDetail.value?.messages.push({
    message: message.value,
    sender: 'user',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
  })

  socket?.send({
    data: message.value
  })

  message.value = ''
}

function bodyClick(e: any) {
  showHandle.value = false
}


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

  socket.onMessage((e) => {
    console.log('收到消息', e);
    if (e.data === '__SendSuccess__') {
      // 发送信息成功的回调
      uni.showToast({
        title: "消息发送成功"
      })
    }
  })

  socket.send({ data: 'halo' })

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
          <template v-if="item.sender === 'shop'">
            <view class="flex">
              <u-image :src="chatRoomDetail?.shop_detail.pictureUrl" height="3rem" width="3rem" class="px-2" />
              <view class="flex-1 bg-white border-rounded p-2 mr-5rem arrow-left">
                {{ item.message }}
              </view>
            </view>
          </template>
          <!-- 用户在右侧 -->
          <template v-if="item.sender === 'user'">
            <view class="flex">
              <view class="flex-1 bg-white border-rounded p-2 ml-5rem arrow-right">
                {{ item.message }}
              </view>
              <u-image :src="chatRoomDetail?.user_detail.avatar" height="3rem" width="3rem" class="px-2" />
            </view>
          </template>
        </template>
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