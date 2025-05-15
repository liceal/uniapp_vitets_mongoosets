<template>
  <view class="safe-container">
    <LNav />

    <u-button type="primary">123</u-button>
    <u-input />

    <l-tabbar />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LNav from '@/components/LNav.vue';

const title = ref('Hello')
</script>

<style></style>