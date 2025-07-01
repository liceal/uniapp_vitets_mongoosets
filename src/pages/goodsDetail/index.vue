<template>
  <Layout :bgGray="false" isCustomNavBar topVirtual>
    <template #body>

      <!-- 顶部操作 -->
      <!-- <TopView /> -->

      <!-- 商品 -->
      <u-swiper :list="imgList" img-mode="aspectFit" class="swiper" height="700">
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
      <view style="border-top: .5rem solid #efefef;" class="bg-white">
        <!-- 查看更多 -->
        <view class="flex justify-between p-1" style="border-bottom: 1px solid #efefef;" @click="commentClick">
          <view>
            商家评价（80）
          </view>
          <view class="text-gray-4">
            <text>查看全部</text>
            <u-icon name="arrow-right" />
          </view>
        </view>
        <!-- 部分评价 -->
        <view>
          <view v-for="item in 2" :key="item" class="px-1 py-2">
            <view class="flex items-center gap-x-1">
              <u-avatar size="40"
                src="https://avatar3-2.pddpic.com/a/Q0xhc1Y2QnZHYVZybHNSN0JwUUU1WFROa1RZTHRFNi93QT09djA0-1738393838?imageMogr2/thumbnail/100x" />
              <text>
                张三
              </text>
            </view>
            <view class="line-clamp-2">物流很快，敏感肌可用，孩子爱吃～值得购买！物流很快，敏感肌可用，孩子爱吃～值得购买！物流很快，敏感肌可用，孩子爱吃～值得购买！</view>
          </view>
        </view>

        <u-popup v-model="popupVisible_comment" mode="bottom" safe-area-inset-bottom>
          <view class="flex p-1 justify-center items-center" style="border-bottom: 1px solid #efefef;">
            商品评价(14,835)
            <u-icon name="close" class="float-right text-gray absolute right-4" @click="popupVisible_comment = false" />
          </view>
          <scroll-view scroll-y class="h-80vh bg-[#efefef]" @scrolltolower="onScrolltolower_comments">
            <!-- 评论分类 -->
            <view class="p-1 box-border border-bottom-ef bg-white">
              <view>
                <view class="flex gap-1 flex-wrap" :class="commentClassIsMore ? '' : 'max-h-8rem overflow-hidden'">
                  <view v-for="clas in commentClasses" :key="clas._id" class="px-2 py-1 bg-pink-1 text-gray-5 rounded"
                    :class="{ '!bg-red-5 text-white': activeClas?._id === clas._id, '!bg-gray-2': clas.type === 2 }"
                    @click="() => clasClick(clas)">
                    <u-icon v-if="clas.icon" :name="clas.icon" />
                    <text>{{ clas.des }}</text>
                    <text v-if="clas.number">({{ clas.numberStr }})</text>
                  </view>
                </view>
                <view @click="commentClassIsMore = !commentClassIsMore"
                  class="w-full flex justify-center text-gray p-1">
                  <u-icon :name="commentClassIsMore ? 'arrow-up' : 'arrow-down'" />
                </view>
              </view>
            </view>
            <!-- 每一条评论 -->
            <view class="flex flex-col gap-2">
              <Comment v-for="item in commentList" :key="item._id" v-bind="item" />
            </view>
            <u-loadmore v-show="isFetch_comment" status="loading" />
          </scroll-view>
        </u-popup>

      </view>

      <!-- 商品详情 -->
      <view style="border-top: .5rem solid #efefef;" class="bg-white">
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
              <u-image width="7rem" height="7rem" mode="aspectFit" :src="activeSkus?.image || imgList?.[0].image" />
              <view class="flex flex-col gap-1">
                <view>
                  <text class="text-red">券后￥{{ activeSkus?.price }}</text>
                  <!-- <text class="text-red text-xs">.95起</text> -->
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
            <view v-for="attr in goodsAttrs?.attrs" :key="attr._id" class="py-2"
              style="border-bottom: 1px solid #efefef;">
              <view>{{ attr.name }}</view>
              <view class="flex gap-1 mt-2 flex-wrap">
                <text v-for="val in attr.values" :key="val._id" class="py-1 px-2 rounded bg-gray-1"
                  :class="{ 'bg-red': val.is_check }" @click="() => skuClick(attr, val)">{{ val.name }}
                  {{ val.is_avaliable }}
                </text>
              </view>
            </view>
          </view>
        </scroll-view>
        <u-button type="primary" @click="skuConfirm">确认</u-button>
      </u-popup>
    </template>
  </Layout>
</template>

<script setup lang='ts'>
import { computed, nextTick, onMounted, ref } from 'vue';
import Layout from '@/components/layout/index.vue'
import TopView from '@/components/TopView.vue';
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import GoodsList from '@/components/GoodsList.vue';
import Comment from './comment.vue'
import comments from '@/api/comments';
import type { CommentClassTypes, CommentsListTypes, GoodsAttrsTypes, GoodsTypes } from 'types/server';
import goods from '@/api/goods';
import type { SkuGroupTypes, SkuGroupValueTypes, SkuTypes } from 'types/sku';
import { deepEqual } from '@/utils';

const goods_id = ref('')

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

// sku功能
const popupVisible_sku = ref(false)
const popupForm = ref({
  number: 1,
  skus: {} as { [key: string]: string }
})
const goodsAttrs = ref<GoodsAttrsTypes>()
const activeSkus = ref<SkuTypes>()
const skuStr = computed(() => {
  // 根据sku计算出str
  // if (popupForm.value.skus.length) {
  //   return `已选择: ${popupForm.value.skus.join(',')}`
  // } else {
  //   return `请选择: 型号 款式`
  // }
  // 根据attr的属性 遍历is_check判断是否选择
  let strArr = [] as string[]
  goodsAttrs.value?.attrs.forEach(v => {
    let check = v.values.find(v1 => v1.is_check)
    if (check) {
      strArr.push(`${v.name}:${check?.name}`)
      popupForm.value.skus[v.name] = check.name
    } else {
      delete popupForm.value.skus[v.name]
    }
  })
  if (strArr.length) {
    return strArr.join(' ')
  } else {
    return `请选择: 型号 款式`
  }
})
function clickPay() {
  getSkus()
  popupVisible_sku.value = true
}
function skuClick(attr: SkuGroupTypes, val: SkuGroupValueTypes) {

  // 直接改变属性值
  if (val.is_check) {
    val.is_check = false
  } else {
    attr.values.forEach(v => v.is_check = false)
    val.is_check = true
  }

  nextTick(() => {
    // 这个属性更改后 获取他的唯一sku属性

    // 获取此属性的唯一sku内容
    let sku = goodsAttrs.value?.skus.find(v => {
      return deepEqual(v.attr, popupForm.value.skus)
    })

    console.log(sku);
    activeSkus.value = sku
  })
}
function getSkus() {
  goods.goodsAttrs.post({ goods_id: goods_id.value })
    .then(res => {
      goodsAttrs.value = {
        ...res,
        attrs: res.attrs.map(v => {
          v.values.map(v1 => v1.is_check = false)
          return v
        })
      }
    })
}

// 评论功能
const popupVisible_comment = ref(false)
const commentClassIsMore = ref(false)
const commentPage = ref(1)
const commentList = ref<CommentsListTypes["data"]>()
const isFetch_comment = ref(false)
const activeClas = ref<CommentClassTypes | null>()
function commentClick() {
  getCommentList()
  getCommentClasses()
  popupVisible_comment.value = true
}
function getCommentList(next?: boolean) {
  if (isFetch_comment.value) {
    return
  }
  // 获取数据
  if (next) {
    commentPage.value += 1
  }
  isFetch_comment.value = true
  comments.list
    .post({ page: commentPage.value, limit: 3 })
    .then(res => {
      if (next) {
        if (!res.data.length) {
          commentPage.value -= 1
          return
        } else {
          commentList.value = commentList.value?.concat(res.data)
        }
      } else {
        commentList.value = res.data
      }
    })
    .finally(() => {
      isFetch_comment.value = false
    })
}
// 评论到底加载更多
function onScrolltolower_comments() {
  getCommentList(true)
}
// 评论分类
const commentClasses = ref<CommentClassTypes[]>()
function getCommentClasses() {
  comments.classes
    .get({
      noPage: 1,
    })
    .then(res => {
      commentClasses.value = res
    })
}
// 点击分类
function clasClick(clas: CommentClassTypes | null) {
  if (activeClas.value?._id === clas?._id) {
    activeClas.value = null
  } else {
    activeClas.value = clas
  }
  commentPage.value = 1
  getCommentList()
}

// 款式确认进行购买
function skuConfirm() {
  // h5
  console.log('确认款式', popupForm.value)
  if (activeSkus.value?._id) {
    // 要先选择sku
    uni.navigateTo({
      url: `/pages/order/orderPre?goods_id=${goods_id.value}&sku_id=${activeSkus.value?._id}`
    })
  }
}

onLoad((options) => {
  console.log(options);
  goods_id.value = options?.goods_id
})

onMounted(() => {
  // 监听页面滚动事件
  onPageScroll(e => {
    console.log(e);

  });

});

defineOptions({
  onPageScroll(e) {
    console.log(e);

  }
})
</script>

<style lang='scss' scoped>
.swiper {
  //height: 100vw;

  :deep(uni-swiper) {
    height: 100%;
  }

}
</style>