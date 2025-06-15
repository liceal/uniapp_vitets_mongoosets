<template>
  <view>
    <u-button @click="logout">登出</u-button>
  </view>
</template>

<script setup lang='ts'>
import { useUserStore } from '@/stores';

const userStore = useUserStore()
async function logout() {
  await userStore.logout()

  uni.switchTab({
    url: '/pages/mine/index'
  })
}
</script>

<style lang='scss' scoped></style>