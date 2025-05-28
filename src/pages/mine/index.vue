<template>
  <view class="content">
    <text>我的页面</text>
    <u-input />

    <l-tabbar />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('我的')
</script>

<style scoped></style>