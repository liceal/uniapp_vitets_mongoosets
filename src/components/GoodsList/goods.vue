<template>
  <view class="goods">
    <u-image class="image" src="https://img.pddpic.com/gaudit-image/2025-03-11/924d53c675061bdcc7722c0ce56bb7df.jpeg" />
    <view>
      <view>
        {{ props.name }}
      </view>
      <view>
        <text style="color:red;">
          <text style="font-size: .8rem;">券后</text>
          <text>
            <text style="font-size: .7rem;">￥</text>
            {{ props.price }}
          </text>
        </text>
        <text style="color:gray;font-size: .8rem;margin-left: .1rem;">
          {{ props.sales_str }}
        </text>
      </view>
    </view>

  </view>
</template>

<script lang='ts' setup>
export type wGoodsType = {
  id: number,//id
  name: string,//名称
  price: number,//价格
  sales_str: string,//售价字符串
  price_type: 0 | 1,//0无 1券后
  sales_type: 0 | 1,//0无 1总售
}
// 使用 withDefaults 简化 defineProps
const props = withDefaults(defineProps<wGoodsType>(), {
  id: 0,
  name: '',
  price: 0,
  sales_str: '',
  price_type: 0,
  sales_type: 0,
});
</script>

<style lang="scss" scoped>
.goods {
  background-color: white;

  .image {
    aspect-ratio: 1/1;
    width: 100%;
    display: flex;
  }
}
</style>