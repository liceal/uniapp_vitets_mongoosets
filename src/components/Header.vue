<template>
  <view>
    <view class="flex justify-between items-center relative border-b-solid border-b-gray1 p-2 text-lg">
      <view class="absolute w-full text-center left-0">
        {{ props.title }}
      </view>
      <u-icon v-if="props.showBack" name="arrow-left" @click="back" size="40" />
      <u-icon v-if="props.showSearch" name="search" size="40" />
    </view>
  </view>
</template>

<script setup lang='ts'>
import { back } from '@/utils';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  },
  showSearch: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang='scss' scoped></style>