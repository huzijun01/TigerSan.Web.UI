<template>
    <div class="page-content flex-stretch" ref="refRoot"></div>
</template>

<script lang="ts" setup>
import DefaultPage from './DefaultPage.vue'
import { shallowRef, onMounted, type App, onBeforeMount } from 'vue'
import { useRouter } from '../../stores'
import { RouterPageModel } from '../../models'
import { ComponentHelper } from '../../helpers'

// 字段:
let appCache: App | undefined
const router = useRouter()
const refRoot = shallowRef<HTMLElement | undefined>()

RouterPageModel._onPageChange = page => {
    if (!refRoot.value) {
        console.warn('The refRoot is undefined!')
        return
    }

    if (appCache && refRoot.value.children.length > 0) {
        appCache.unmount()
        appCache = undefined
    }

    // 创建App:
    appCache = ComponentHelper.CreateApp(page.component ?? DefaultPage)

    // 挂载:
    appCache.mount(refRoot.value)
}

onMounted(() => {
    router.GoTo('/')
})

onBeforeMount(() => {
    appCache?.unmount()
    appCache = undefined
})
</script>

<style lang="less" scoped></style>