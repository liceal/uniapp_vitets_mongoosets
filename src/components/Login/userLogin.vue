<template>
  <view>
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
      <u-button class="w-full" @click="back">返回</u-button>
    </view>
  </view>
</template>

<script setup lang='ts'>
import user from '@/api/user';
import { useUserStore } from '@/stores';
import type { CaptchaCacheTypes, UserLoginReqTypes } from 'types/server';
import { onMounted, ref } from 'vue';

const emits = defineEmits(['back', 'loginSuccess'])

const userStore = useUserStore()

const form = ref<UserLoginReqTypes>({
  username: '',
  password: '',
  captchaText: '',
  captchaKey: ''
})

function back() {
  emits('back')
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
    userStore.setUserInfo(res.data)

    emits('loginSuccess')
  } catch (e) {
    console.log('login登录异常', e);
  }
}

const captcha = ref<CaptchaCacheTypes>()
async function getCaptcha() {
  console.log('获取验证码');

  const res = await user.captchaCache
    .get()
  captcha.value = res
  form.value.captchaKey = res.captchaKey
}

onMounted(() => {
  getCaptcha()
})
</script>

<style lang='scss' scoped></style>