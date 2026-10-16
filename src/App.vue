<template>
    <div class="app-panel flex-stretch full-view">
        <RouterPage />
    </div>
</template>

<script lang="ts" setup>
import Home from "./routes/Home/Home.vue"
import { createRouter, RouterPage } from "./packages/index"

createRouter([
    {
        path: '/',
        component: Home
    },
])
</script>

<style lang="less" scoped></style>