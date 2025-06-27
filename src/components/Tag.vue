<template>
  <view class="px-1 inline-block text-xs" :class="cpType">
    <slot />
  </view>
</template>

<script setup lang='ts'>
import { computed } from 'vue';

enum TagType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

const props = defineProps({
  type: {
    type: String as () => TagType,  // 指定为枚举类型
    default: TagType.SUCCESS,       // 使用枚举值作为默认值
    validator: (value: TagType) => Object.values(TagType).includes(value)  // 验证器确保传入值合法
  }
})

const cpType = computed(() => {
  if (props.type === TagType.SUCCESS) {
    return 'text-white bg-green-6'
  } else if (props.type === TagType.WARNING) {
    return 'text-white bg-yellow-5'  // 警告状态 - 黄色
  } else if (props.type === TagType.ERROR) {
    return 'text-white bg-red-5'     // 错误状态 - 红色
  } else {
    return 'text-gray-7 bg-gray-2'   // 默认状态 - 灰色
  }
})
</script>

<style lang='scss' scoped></style>