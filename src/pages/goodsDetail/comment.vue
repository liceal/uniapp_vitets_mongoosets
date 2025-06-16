<template>
  <view class="p-1 flex flex-col gap-2 bg-white">
    <view class="flex gap-1">
      <u-avatar size="40" :src="props.userDetail.avatar" />
      <text>{{ props.userDetail.username }}</text>
    </view>
    <view class="text-gray">
      {{ props.skuStr }}
    </view>
    <view>
      {{ props.comment }}
    </view>
    <view class="flex justify-between">
      <u-image v-for="(img, k) in props.imgs" :key="k" :src="img" mode="aspectFill" height="32vw" width="32vw" />
    </view>
    <view class="flex justify-end gap-2 text-gray-5">
      <view>
        <u-icon name="thumb-up" />
        <text>{{ props.likeCount }}</text>
      </view>
      <view>
        <u-icon name="chat" />
        <text>评论</text>
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>
import type { CommentTypes } from 'types/server';

const props = defineProps<CommentTypes>()
</script>

<style lang='scss' scoped></style>