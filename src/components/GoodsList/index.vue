<template>
  <view class="goods_list">
    <view v-for="goods in goodsList" :key="goods.id">
      <Goods />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import Goods from './goods.vue';

const goodsList = reactive([
  {
    id: 1,
    name: "商品名称1",
    price: 7628,
    sales_str: '总售200万+件',//售量
    price_type: 1,//0无 1券后
    sales_type: 1,//0无 1总售
  },
  {
    id: 2,
    name: "商品名称2",
    price: 6.4,
    sales_str: '已抢24.7万+支',//售量
    price_type: 1,//0无 1券后
    sales_type: 1,//0无 1总售
  },
  {
    id: 3,
    name: "商品名称3",
    price: 46.8,
    sales_str: '全店已拼40万+件',//售量
    price_type: 1,//0无 1券后
    sales_type: 1,//0无 1总售
  },
])
</script>

<style lang="scss" scoped>
.goods_list {
  background-color: $my-bg-gray;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .2rem;
  padding: .2rem;
}
</style>