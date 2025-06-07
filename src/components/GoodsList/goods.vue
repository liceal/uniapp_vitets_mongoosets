<template>
  <view class="goods">
    <u-image class="image" :src="props.pictureUrl" height="200px" mode="aspectFit" />
    <!-- <image src="https://img.pddpic.com/gaudit-image/2025-03-11/924d53c675061bdcc7722c0ce56bb7df.jpeg" /> -->
    <view>
      <view>
        {{ props.name }}
      </view>
      <view>
        <text class="text-red">
          <text style="font-size: 0.8rem">券后</text>
          <text>
            <text style="font-size: 0.7rem">￥</text>
            {{ props.price }}
          </text>
        </text>
        <text style="color: gray; font-size: 0.8rem; margin-left: 0.1rem">
          {{ props.sales_str }}
        </text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
export interface GoodsPropsTypes {
  id: string; //商品ID
  name: string; //商品名称
  price: number; //商品价格
  pictureUrl: string; //商品图片
  shopId: string; //商品所属店铺
  createdAt: string; //创建时间
  updatedAt: string; //更新时间
  sales_str: string; //价格描述 拼接的字段 例如：¥10.00 券后¥9.00 总售100件
  price_type: 0 | 1; //0无 1券后
  sales_type: 0 | 1; //0无 1总售
}

// 使用 withDefaults 简化 defineProps
const props = withDefaults(defineProps<GoodsPropsTypes>(), {
  id: "",
  name: "",
  price: 0,
  sales_str: "",
  price_type: 0,
  sales_type: 0,
  pictureUrl: "",
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
