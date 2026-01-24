<template>
    <div class="page-view flex-stretch" ref="refRoot"></div>
</template>

<script lang="ts" setup>
import DefaultPage from './DefaultPage.vue'
import { ref, onMounted, type App } from 'vue'
import { CreateApp } from '@/0_tigersan_ui/helpers';
import { NavBarModel } from '@/0_tigersan_ui/models'

// 字段:
const refRoot = ref<HTMLElement | undefined>()
let appMounted: App<Element> | undefined = undefined

let { model } = defineProps({
    model: {
        type: NavBarModel,
        default: new NavBarModel()
    }
})

// 过程:
onMounted(() => {
    UpdatePages()
    model._onSelectedButtonModelChanged = UpdatePages
})

// 方法:
function UpdatePages() {
    if (!refRoot.value) {
        console.log('The refRoot is undefined!')
        return
    }

    // 创建App:
    const app = CreateApp(model.SelectedButtonModel?._component ?? DefaultPage)

    // 卸载:
    if (appMounted) {
        appMounted.unmount()
    }
    appMounted = app

    // 挂载:
    app.mount(refRoot.value)
}
</script>

<style lang="less" scoped></style>