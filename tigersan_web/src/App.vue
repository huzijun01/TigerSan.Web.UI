<template>
  <div class="app-panel flex-stretch full-view">
    <RouterPage />
  </div>
  <Dialog></Dialog>
</template>

<script lang="ts" setup>
import { createRouter, Dialog, RouterPage } from '@/0_tigersan_ui/tigerui'
import Home from "@/routes/Home/Home.vue"
import Login from "@/routes/Login/Login.vue"

createRouter([
  {
    path: '/',
    component: Login
  },
  {
    path: 'Home',
    component: Home
  },
])
</script>

<style lang="less" scoped></style>