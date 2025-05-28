<template>
  <view :style="safeContainer">
    <Search />

    <GoodsList />

    <l-tabbar />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Search from '@/components/Search.vue';
import { useSafeDistanceStore } from '@/stores/safeDistance';
import GoodsList from '@/components/GoodsList/index.vue'

const safeDistanceStore = useSafeDistanceStore();
const safeContainer = computed(() => ({
  paddingTop: `${safeDistanceStore.topSafeAreaHeight}px`,
  paddingBottom: `env(safe-area-inset-bottom)`,
}))
</script>

<style lang="scss" scpoed></style>