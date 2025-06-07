<template>
  <view>
    <u-swiper :list="imgList"></u-swiper>
  </view>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const imgList = ref(
  [
    {
      image: 'https://img.pddpic.com/mms-material-img/2024-08-29/1a46194d-336e-4d8f-8e52-694a15afe16b.jpeg?imageMogr2/thumbnail/400x%7CimageView2/2/w/400/q/80/format/webp',
      title: '昨夜星辰昨夜风，画楼西畔桂堂东'
    },
    {
      image: 'https://img.pddpic.com/open-gw/2023-02-24/3776c699-d986-43a7-8bfe-83a7b6035b50.jpeg?imageMogr2/thumbnail/400x%7CimageView2/2/w/400/q/80/format/webp',
      title: '身无彩凤双飞翼，心有灵犀一点通'
    },
    {
      image: 'https://img.pddpic.com/open-gw/2023-02-24/3776c699-d986-43a7-8bfe-83a7b6035b50.jpeg?imageMogr2/thumbnail/400x%7CimageView2/2/w/400/q/80/format/webp',
      title: '身无彩凤双飞翼，心有灵犀一点通'
    },
  ]
)
</script>

<style lang='scss' scoped></style>