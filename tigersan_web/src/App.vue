<template>
  <div class="app-panel">
    <RouterView />
  </div>
  <Dialog></Dialog>
</template>

<script lang="ts" setup>
import { Dialog } from '@/tigerui'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRouterStore } from '@/stores'

const router = useRouter()

onMounted(() => {
  const routerHelper = useRouterStore()
  routerHelper.go = (path: string) => {
    router.replace(path)
  }
})
</script>

<style lang="less" scoped>
.app-panel {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>