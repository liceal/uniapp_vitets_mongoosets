<template>
  <view>
    <view v-if="!showType">

      <u-button @click="() => changeShowType('user')">用户名登录</u-button>
      <u-button>手机号登录</u-button>
    </view>
    <view v-else-if="showType === 'user'">
      <UserLogin @back="back" @login-success="loginSuccess" />
    </view>

  </view>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import UserLogin from './userLogin.vue'

const emits = defineEmits(['loginSuccess'])

const showType = ref('user')

function changeShowType(type: string) {
  showType.value = type
}

function back() {
  showType.value = ''
}

function loginSuccess() {
  emits('loginSuccess')
}
</script>

<style lang='scss' scoped></style>