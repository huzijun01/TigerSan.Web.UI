<template>
  <PageCard>
    <div class="loading flex-stretch">
      <button @click="Show">{{ Texts.Loading.value }}</button>
    </div>
  </PageCard>
</template>

<script lang="ts" setup>
import { loading, PageCard, Texts, TimerHelper } from '../../../packages'

async function Show() {
  try {
    loading.IsShow.value = true
    await TimerHelper.Sleep(3000)
  } finally {
    loading.IsShow.value = false
  }
}
</script>

<style lang="less" scoped>
.loading {
  flex-direction: column;
}
</style>