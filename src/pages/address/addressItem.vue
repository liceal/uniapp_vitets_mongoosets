<template>
  <view class="py-2" :class="props.is_top ? 'bg-gray-1' : 'bg-white'">
    <view class="flex justify-end gap-2 color-gray-4 px-2">
      <view class="iconfont-n icon-to-top !text-[1.5rem]" :class="{ 'rotate-180': props.is_top }" @click="onTop" />
      <view class="iconfont-n icon-cuo !text-[1.5rem]" @click="onDel" />
    </view>
    <view class="px-2 pb-2 flex flex-col gap-1 text-[1rem]" @click="onCheck">
      <view>{{ props.username }}, {{ props.phone }}</view>
      <view>{{ props.address_full }}</view>
    </view>
    <view class="border-top-ef flex justify-between items-center pt-2 px-2">
      <view class="flex items-center gap-1" @click="defaultClick">
        <view class="rounded-full flex justify-center items-center w-1rem h-1rem box-border"
          :class="props.is_default ? 'bg-red-5 text-white' : 'border-gray border-solid border-2'">
          <u-icon name="checkmark" v-if="props.is_default" />
        </view>
        <text>默认</text>
      </view>
      <view class="flex gap-1">
        <u-button size="medium"
          @click="() => copy(`${props.username} ${props.phone} ${props.address_full}`)">复制</u-button>
        <u-button size="medium" @click="edit">修改</u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { copy } from '@/utils';
import type { AddressesTypes } from 'types/server';

const emits = defineEmits(['top', 'setDefault', 'edit', 'delete', 'check'])

const props = defineProps<AddressesTypes>()

async function onTop() {
  emits('top')
}

function defaultClick(e: Event) {
  e.stopPropagation()
  emits('setDefault')
}

function edit() {
  emits('edit')
}

function onDel() {
  emits('delete')
}

function onCheck() {
  emits('check')
}
</script>

<style lang='scss' scoped></style>