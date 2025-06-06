<template>
  <Layout :show-tab-bar="false">
    <template #header>
      <Search is-search />
    </template>
  </Layout>
</template>

<script lang='ts' setup>
import Search from '@/components/Search.vue';
import Layout from '@/components/layout/index.vue';
</script>