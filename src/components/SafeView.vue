<template>
  <view class="safeContainer">
    <view :style="safeHeight"/>
    <slot/>
  </view>
</template>

<script lang='ts' setup>
import { useSafeDistanceStore } from "@/stores/safeDistance";
import { computed, type CSSProperties } from "vue";
const safeDistanceStore = useSafeDistanceStore();
const safeHeight=computed<CSSProperties>(()=>{
  return {
    height:`${safeDistanceStore.topSafeAreaHeight}px`,
    backgroundColor: 'white',
  }
})
</script>

<style lang="scss" scoped>
.safeContainer{
  padding-bottom:env(safe-area-inset-bottom)
}
</style>