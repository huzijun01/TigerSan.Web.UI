<template>
  <div class="app-panel flex-stretch">
    <RouterPage />
  </div>
  <Dialog></Dialog>
</template>

<script lang="ts" setup>
import { createRouter, Dialog, RouterPage } from '@/tigerui'
import Home from "@/routes/Home.vue"
import Login from "@/routes/Login/Login.vue"

createRouter([
  {
    path: '/',
    component: Home
  },
  {
    path: 'Login',
    component: Login
  },
])
</script>

<style lang="less" scoped>
.app-panel {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>