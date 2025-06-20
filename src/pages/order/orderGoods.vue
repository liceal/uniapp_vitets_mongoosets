<template>
  <view class="bg-white p-2 flex flex-col">
    <view class="flex items-center gap-1">
      <u-avatar src="https://img.pddpic.com/gaudit-image/2025-03-11/924d53c675061bdcc7722c0ce56bb7df.jpeg" size="50" />
      <text class="line-clamp-1 w-40vw">店铺名称店铺名称店铺名称店铺名称</text>
      <u-icon name="arrow-right" class="text-gray" />
    </view>

    <!-- 商品 -->
    <view>
      <view class="flex pt-2 gap-1">
        <u-image width="7rem" height="7rem" mode="aspectFit"
          src="https://img.pddpic.com/gaudit-image/2025-03-11/924d53c675061bdcc7722c0ce56bb7df.jpeg" />
        <view class="flex-1 flex flex-col justify-between">
          <view class="line-clamp-2 text-1.1em">
            商品名字商品名字商品名字商品名字商品名字商品名字商品名字商品名字商品名字商品名字商品名字商品名字
          </view>
          <view class=" text-gray">
            6609黑色；L；建议115-135斤
          </view>
          <view class="flex gap-1">
            <view class="bg-#24b613 text-white px-1">退货包运费</view>
            <view class="bg-#24b613 text-white px-1">7天无理由退货</view>
          </view>
        </view>
        <view>
          <view>x79</view>
          <view class="text-gray">x1</view>
        </view>
      </view>
      <view class="text-end mt-2">
        <view class="btn-info"><u-icon name="chat" class="text-#24b613" size="40" />联系商家</view>
      </view>
      <view class="border-top-ef text-end">
        应付:<text class="text-xs text-red-5">￥</text><text class="text-lg text-red-5">79</text>
        (免运费)
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>

</script>

<style lang='scss' scoped></style>