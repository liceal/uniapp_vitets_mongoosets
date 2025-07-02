<script setup lang='ts'>
import Layout from '@/components/layout/index.vue'
import gsap from 'gsap'
import { ref, watch } from 'vue'

const chatTitle = ref('初始聊天室标题')

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

const msgList = ref([
  {
    type: "time",
    time_str: "星期五 09:55"
  },
  {
    type: "message",
    avatar: "https://img.pddpic.com/gaudit-image/2025-03-11/924d53c675061bdcc7722c0ce56bb7df.jpeg",
    message: "我是用户啊啊啊啊",
    user_type: 'user',
  },
  {
    type: "message",
    avatar: "https://img.pddpic.com/gaudit-image/2025-03-11/924d53c675061bdcc7722c0ce56bb7df.jpeg",
    message: "- 不会自动断电呢，充满是会进入一个涓流状态的，不是快充状态，这也是一个过充保护的哈~",
    user_type: 'shop',
  },
])

const message = ref('')
function msgSend(e: any) {
  uni.showToast({
    title: message.value
  })
  console.log(e, message.value);
  msgList.value.push({
    type: 'message',
    avatar: 'https://img.pddpic.com/gaudit-image/2025-03-11/924d53c675061bdcc7722c0ce56bb7df.jpeg',
    message: message.value,
    user_type: 'user',
  })
  message.value = ''
}

function bodyClick(e: any) {
  showHandle.value = false
}

</script>

<template>
  <Layout @body-click="bodyClick">
    <template #body>
      <view class="flex flex-col gap-4 pt-4">
        <template v-for="(item, k) in msgList" :key="k">
          <view v-if="item.type === 'time'" class="text-gray text-xs py-2 text-center">
            {{ item.time_str }}
          </view>
          <template v-if="item.type === 'message'">
            <!-- 商户在左侧 -->
            <template v-if="item.user_type === 'shop'">
              <view class="flex">
                <u-image :src="item.avatar" height="3rem" width="3rem" class="px-2" />
                <view class="flex-1 bg-white border-rounded p-2 mr-5rem arrow-left">
                  {{ item.message }}
                </view>
              </view>
            </template>
            <!-- 用户在右侧 -->
            <template v-if="item.user_type === 'user'">
              <view class="flex">
                <view class="flex-1 bg-white border-rounded p-2 ml-5rem arrow-right">
                  {{ item.message }}
                </view>
                <u-image :src="item.avatar" height="3rem" width="3rem" class="px-2" />
              </view>
            </template>
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