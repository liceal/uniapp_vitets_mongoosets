<template>
  <Layout>
    <template #body>

      <!-- 顶部操作 -->
      <TopView />

      <!-- 商品 -->
      <u-swiper :list="imgList" img-mode="aspectFit" class="swiper" height="600">
      </u-swiper>

      <!-- 价格 -->
      <view class="flex justify-between items-baseline p-1">
        <text class="text-red-6">
          4.3折¥<text style="font-size: 1.5rem;">4.5</text>起
        </text>
        <text style="color:gray">已拼807件</text>
      </view>

      <!-- 属性 -->
      <view class="m-1 p-1 text-green-5 bg-green-1 text-sm">
        <u-icon name="rmb-circle-fill" />
        <text>先用后付｜支持0元下单，确认收货后再付款</text>
      </view>

      <!-- 商品名称 -->
      <view class="m-1">
        <text class="line-clamp-2">【预计15小时内发货】一家一家一家一家一家一家一家一家一家一家一家一家一家一家一家一家一家一家一家一家</text>
      </view>

      <!-- 商品特性 -->
      <view class="flex color-gray p-1" @click="goodsServerClick">
        <text class="line-clamp-1">
          全场包邮 | 满50元减5元 | 满100元减10元 | 满50元减5元 | 满100元减10元 | 满50元减5元 | 满100元减10元 | 满50元减5元 | 满100元减10元
        </text>
        <u-icon name="arrow-right" />
      </view>
      <u-popup v-model="popupVisible" mode="bottom" safe-area-inset-bottom>
        <view class="relative flex p-1 justify-center items-center" style="border-bottom: 1px solid #efefef;">
          服务说明
          <u-icon name="close" class="float-right text-gray absolute right-4" @click="() => popupVisible = false" />
        </view>
        <scroll-view class="h-40vh p-1" scroll-y>
          <view v-for="item in 10" :key="item" class="mt-1">
            <view class="text-dark">
              全场包邮
            </view>
            <view class="text-sm text-gray">
              所有商品包邮
            </view>
          </view>
        </scroll-view>
      </u-popup>

      <!-- 评价 -->
      <view style="border-top: .5rem solid #efefef;">
        <view class="flex justify-between p-1" style="border-bottom: 1px solid #efefef;">
          <text>
            商家评价（80）
          </text>
          <text class="text-gray-4">
            查看全部
            <u-icon name="arrow-right" />
          </text>
        </view>
        <view>
          <view v-for="item in 2" :key="item" class="px-1 py-2">
            <view class="flex items-center gap-x-1">
              <u-avatar size="60"
                src="https://avatar3-2.pddpic.com/a/Q0xhc1Y2QnZHYVZybHNSN0JwUUU1WFROa1RZTHRFNi93QT09djA0-1738393838?imageMogr2/thumbnail/100x"></u-avatar>
              <text>
                张三
              </text>
            </view>
            <view class="line-clamp-2">物流很快，敏感肌可用，孩子爱吃～值得购买！物流很快，敏感肌可用，孩子爱吃～值得购买！物流很快，敏感肌可用，孩子爱吃～值得购买！</view>
          </view>
        </view>
      </view>

      <!-- 商品详情 -->
      <view style="border-top: .5rem solid #efefef;">
        <view class="flex justify-between p-1" style="border-bottom: 1px solid #efefef;">
          <text>
            商品详情
          </text>
          <text class="text-gray-4">
            <u-icon name="question-circle" size="30" />
          </text>
        </view>

        <view class="flex gap-2 justify-center bg-gray-1 p-1 m-1">
          <view v-for="item in 3" :key="item" class="flex flex-col flex-1 justify-center items-center">
            <text class="text-gray-4">
              发货地
            </text>
            <text>
              广东省
            </text>
          </view>
        </view>

        <u-image v-for="item in 3" :key="item"
          src="https://img-3.pddpic.com/garner-api-new/8b60a95aca982f998eba3ff449d600a1.jpeg?imageView2/2/w/1300/q/80"
          mode="widthFix" class="flex" />
      </view>

      <!-- 回到顶部 -->
      <u-back-top :scroll-top="scrollTop" icon="arrow-up" tips="顶部" class="!bg-white" />

      <!-- 精选推荐 -->
      <view style="border-top: .5rem solid #efefef;">
        <view class="flex justify-center items-center text-red-4 p-2 gap-2"><u-icon name="heart-fill" /> 精选推荐</view>
        <GoodsList ref="goodsListRef" />
      </view>
    </template>
    <template #footer>
      <view class="bg-white flex">
        <view class="flex gap-4 px-2 py-1">
          <view class="flex flex-col justify-center items-center">
            <u-icon name="home" size="40" />
            <text class="leading-none">品牌</text>
          </view>
          <view class="flex flex-col justify-center items-center">
            <u-icon name="heart" size="40" />
            <text class="leading-none">收藏</text>
          </view>
          <view class="flex flex-col justify-center items-center">
            <u-icon name="chat" size="40" />
            <text class="leading-none">客服</text>
          </view>
        </view>
        <view class="flex-1 bg-red-5 active:bg-red-6 flex justify-center items-center text-white" @click="clickPay">
          购买
        </view>
      </view>

      <!-- 规格选择 -->
      <u-popup v-model="popupVisible_sku" mode="bottom" safe-area-inset-bottom>
        <view class="flex p-1 justify-center items-center" style="border-bottom: 1px solid #efefef;">
          确认款式
          <u-icon name="close" class="float-right text-gray absolute right-4" @click="() => popupVisible_sku = false" />
        </view>
        <scroll-view scroll-y class="h-60vh">
          <view class="p-2 box-border">
            <!-- 商品 -->
            <view class="flex gap-2 pb-2" style="border-bottom: 1px solid #efefef;">
              <u-image width="7rem" height="7rem" mode="aspectFit"
                src="https://img-3.pddpic.com/garner-api-new/8b60a95aca982f998eba3ff449d600a1.jpeg?imageView2/2/w/1300/q/80" />
              <view class="flex flex-col gap-1">
                <view>
                  <text class="text-red">券后￥1</text>
                  <text class="text-red text-xs">.95起</text>
                  <text class="text-xs ml-1 text-gray-5">大促价￥2.29-3.78</text>
                </view>
                <view class="flex gap-1">
                  <text class="border-red-5 border-1 border-solid text-red-5 px-1 bg-red-1">2件9.9折</text>
                  <text class="border-red-5 border-1 border-solid text-red-5 px-1 bg-red-1">每满200减30</text>
                </view>
                <view class="h-2rem text-xs">{{ skuStr }}</view>
                <u-number-box v-model="popupForm.number" :min="1" />
              </view>
            </view>
            <!-- 规格 -->
            <view v-for="item in 3" :key="item" class="py-2" style="border-bottom: 1px solid #efefef;">
              <view>型号</view>
              <view class="flex gap-1 mt-2 flex-wrap">
                <text v-for="item1 in 5" :key="item1" class="py-1 px-2 rounded bg-gray-1"
                  :class="{ 'bg-red': popupForm.skus.includes(`${item1}${item}`) }"
                  @click="() => skuClick(`${item1}${item}`)">【专享优惠】1包</text>
              </view>
            </view>
          </view>
        </scroll-view>
        <u-button type="primary">确认</u-button>
      </u-popup>
    </template>
  </Layout>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import Layout from '@/components/layout/index.vue'
import TopView from '@/components/TopView.vue';
import { onPageScroll } from '@dcloudio/uni-app';
import GoodsList from '@/components/GoodsList.vue';

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

const popupVisible = ref(false);
function goodsServerClick() {
  popupVisible.value = true;
}

const scrollTop = ref(0);
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
})

// 购买 点击弹出款式选择
const popupVisible_sku = ref(false)
const popupForm = ref({
  number: 1,
  skus: [] as string[]
})
const skuStr = computed(() => {
  // 根据sku计算出str
  if (popupForm.value.skus.length) {
    return `已选择: ${popupForm.value.skus.join(',')}`
  } else {
    return `请选择: 型号 款式`
  }
})
function clickPay() {
  popupVisible_sku.value = true
}
function skuClick(sku: string) {
  const index = popupForm.value.skus.indexOf(sku);
  if (index > -1) {
    // 如果已存在则删除
    popupForm.value.skus.splice(index, 1);
  } else {
    // 如果不存在则添加
    popupForm.value.skus.push(sku);
  }
}

</script>

<style lang='scss' scoped>
.swiper {
  //height: 100vw;

  :deep(uni-swiper) {
    height: 100%;
  }

}
</style>