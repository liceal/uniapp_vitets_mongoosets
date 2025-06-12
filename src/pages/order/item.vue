<template>
  <view class="py-1">
    <!-- 商家 -->
    <view class="flex justify-between items-center px-1">
      <view class="flex gap-1">
        <u-image mode="aspectFill"
          src="https://img-3.pddpic.com/garner-api-new/8b60a95aca982f998eba3ff449d600a1.jpeg?imageView2/2/w/1300/q/80"
          class="!h-1.5rem !w-1.5rem" />
        <text>摩可纳咖啡旗舰店</text>
        <u-icon name="arrow-right" class="text-gray-4" />
      </view>
      <text class="text-red-5">
        待收货
      </text>
    </view>

    <!-- 商品 -->
    <view class="mt-2 flex justify-evenly border-b-gray-1 border-b-solid border-b-1 gap-1 pb-1 px-1">
      <u-image mode="aspectFill"
        src="https://img-3.pddpic.com/garner-api-new/8b60a95aca982f998eba3ff449d600a1.jpeg?imageView2/2/w/1300/q/80"
        class="!w-5rem !h-5rem" />
      <view class="flex flex-col justify-evenly flex-1">
        <text class="line-clamp-2 text-sm">【旗舰店】摩可纳咖啡美式静电速溶冻干粉黑咖啡100g+拿铁嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻</text>
        <text class="line-clamp-1 text-xs text-gray">8号深度烘焙100g+拿铁2条啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</text>
        <view class="flex gap-1 text-xs">
          <view class="text-white bg-green-6 px-1">退货包运费保障中</view>
          <view class="text-white bg-green-6 px-1">7天无理由退货</view>
        </view>
      </view>
      <view class="text-right pl-2">
        <view>
          <text class="text-0.6rem">￥</text>
          <text>54.7</text>
        </view>
        <view class="text-gray">
          x1
        </view>
      </view>
    </view>

    <!-- 付款 -->
    <view class="p-1 border-b-gray-1 border-b-solid border-b-1 ">
      <view class="text-right text-xs">
        <view>先用后付 实付:<text class="text-0.6rem">￥</text>0</view>
        <view>(确认收获后自动付款￥54.7)</view>
      </view>
    </view>

    <!-- 操作 -->
    <view class="flex justify-end items-center p-1 gap-1">
      <text>更多</text>
      <u-button class="m-0" size="mini" type="info">申请售后</u-button>
      <u-button class="m-0" size="mini" type="info">查看物流</u-button>
      <u-button class="m-0" size="mini" type="primary">确认收获</u-button>
    </view>

    <!-- 物流 -->
    <view class="rounded text-gray-4 bg-gray-1 flex gap-1 m-1 p-1 px-2">
      <u-icon name="car" />
      <text>
        商家已发货，正在通知中通快递取件
      </text>
    </view>
  </view>
</template>

<script setup lang='ts'>

</script>

<style lang='scss' scoped></style>