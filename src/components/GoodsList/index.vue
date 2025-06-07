<template>
  <view class="goods_list">
    <view v-for="goods in goodsList" :key="goods.id">
      <Goods v-bind="goods" @click="toDetail" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import Goods, { type GoodsPropsTypes } from './goods.vue';
import goods from '@/api/goods';

const goodsList = ref<GoodsPropsTypes[]>([])

function getGoodsList() {
  console.log('请求')
  goods.goodsList
    .post()
    .then(res => {
      console.log(res);
      goodsList.value = res.data
    })
}

function toDetail() {
  uni.navigateTo({
    url: '/pages/goodsDetail/index'
  })
}

onMounted(() => {
  getGoodsList();
})
</script>

<style lang="scss" scoped>
.goods_list {
  background-color: $my-bg-gray;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .2rem;
  padding: .2rem;
  // 预留空间
  padding-bottom: 2rem;
}
</style>