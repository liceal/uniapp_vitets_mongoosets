<template>
  <scroll-view @scrolltolower="lowerBottom" scroll-y>
    <view class="grid grid-cols-2 gap-1 p-1 box-border">
      <view v-for="goods in goodsList" :key="goods.id" @click="toDetail">
        <Goods v-bind="goods"  />
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import Goods, { type GoodsPropsTypes } from '@/components/Goods.vue';
import goods from '@/api/goods';

const goodsList = ref<GoodsPropsTypes[]>([])

const page = ref(1)
const isFetch = ref(false)
async function getGoodsList() {
  const res = await goods.goodsList
    .post({ page: page.value })
  if (isFetch.value) {
    // 如果没数据则回滚页数
    if (!res.data.length) {
      page.value--;
      return;
    }
    goodsList.value = [...goodsList.value, ...res.data]
    return;
  }
  goodsList.value = res.data
}

function toDetail() {
  console.log(11)
  uni.navigateTo({
    url: '/pages/goodsDetail/index'
  })
}

async function lowerBottom(e: any) {
  console.log('到底了', e)
  if (!isFetch.value) {
    page.value++
    isFetch.value = true
    await getGoodsList()
    isFetch.value = false
  }
}

defineExpose({
  lowerBottom
})

onMounted(async () => {
  await getGoodsList();
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