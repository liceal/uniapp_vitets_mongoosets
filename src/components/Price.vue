<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  price: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0
  },
  // 是否显示元和小数部分
  showYuan: {
    type: Boolean,
    default: true
  },
  showDecimal: {
    type: Boolean,
    default: true
  },
  // 元和小数的样式类
  yuanClass: {
    type: String,
    default: ''
  },
  decimalClass: {
    type: String,
    default: ''
  }
})

// 拆分价格为元和角分
const priceParts = computed(() => {
  const yuan = Math.floor(props.price)
  const decimal = Math.round((props.price - yuan) * 100)
  return { yuan, decimal }
})
</script>

<template>
  <view class="font-bold text-red-6 inline-block">
    <view class="text-xs inline-block">￥</view>
    <view class="inline-block" v-if="showYuan" :class="yuanClass">{{ priceParts.yuan }}</view>
    <view v-if="showDecimal && priceParts.decimal > 0" class="text-xs inline-block" :class="decimalClass">
      .{{ String(priceParts.decimal).padStart(2, '0') }}
    </view>
  </view>
</template>