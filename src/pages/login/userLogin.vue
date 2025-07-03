<template>
  <view>
    <template v-if="type === 'login'">
      <view class="bg-white">
        <u-input v-model="form.username" right-icon="account-fill" placeholder="用户名称" class="!px-2 flex" />
        <u-input v-model="form.password" type="password" placeholder="密码" class="!px-2 flex" />
        <view class="flex w-full">
          <u-input v-model="form.captchaText" placeholder="验证码" class="!px-2 flex flex-1 h-full" />
          <img :src="captcha?.captchaBase64" alt="验证码获取失败" mode="aspectFit" class="!h-50px !w-100px"
            @click="getCaptcha" />
        </view>
      </view>
      <view class="p-2 flex flex-col gap-2">
        <u-button type="primary" class="w-full" @click="login">登录</u-button>
        <u-button class="w-full" @click="toRegister">没有账号？注册一下</u-button>
        <u-button class="w-full" @click="back">返回</u-button>
      </view>
    </template>
    <template v-else="type === 'register'">
      <view class="bg-white">
        <u-input v-model="registerForm.username" right-icon="account-fill" placeholder="用户名称" class="!px-2 flex" />
        <u-input v-model="registerForm.email" type="email" placeholder="邮箱" class="!px-2 flex" />
        <u-input v-model="registerForm.password" type="password" placeholder="密码" class="!px-2 flex" />
        <view class="flex w-full">
          <u-input v-model="registerForm.captchaText" placeholder="验证码" class="!px-2 flex flex-1 h-full" />
          <img :src="captcha?.captchaBase64" alt="验证码获取失败" mode="aspectFit" class="!h-50px !w-100px"
            @click="getCaptcha" />
        </view>
      </view>
      <view class="p-2 flex flex-col gap-2">
        <u-button type="primary" class="w-full" @click="register">注册</u-button>
        <u-button class="w-full" @click="back">返回</u-button>
      </view>
    </template>
  </view>
</template>

<script setup lang='ts'>
import user from '@/api/user';
import { useUserStore } from '@/stores';
import type { CaptchaResTypes, UserCreateReqTypes, UserLoginReqTypes } from 'types/server';
import { onMounted, ref } from 'vue';

const emits = defineEmits(['back', 'loginSuccess'])
const userStore = useUserStore()
const type = ref('login')
const form = ref<UserLoginReqTypes>({
  username: '',
  password: '',
  captchaText: '',
  captchaKey: ''
})
const registerForm = ref<UserCreateReqTypes>({
  username: '',
  email: "",
  password: '',
  captchaKey: '',
  captchaText: ''
})


function back() {
  if (type.value === 'register') {
    type.value = 'login'
  } else {
    emits('back')
  }
}


async function login() {
  try {
    const res = await user.login
      .post(form.value)

    console.log(res);


    uni.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 2000
    });

    uni.setStorageSync('token', res.token)
    uni.setStorageSync('userInfo', res.data)
    userStore.setUserInfo(res.data)

    emits('loginSuccess')
  } catch (e) {
    console.log('login登录异常', e);
    getCaptcha()
  }
}

const captcha = ref<CaptchaResTypes>()
async function getCaptcha() {
  console.log('获取验证码');

  const res = await user.captchaCache
    .get()
  captcha.value = res
  form.value.captchaKey = res.captchaKey
  registerForm.value.captchaKey = res.captchaKey
}

function toRegister() {
  type.value = 'register'
}

function register() {
  user.create
    .post(registerForm.value)
    .then(res => {
      uni.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 2000
      });
      type.value = 'login'
      form.value = {
        username: '',
        password: '',
        captchaText: '',
        captchaKey: ''
      }
      getCaptcha()
    })
    .catch(e => {
      getCaptcha()
    })
}

onMounted(() => {
  getCaptcha()
})
</script>

<style lang='scss' scoped></style>