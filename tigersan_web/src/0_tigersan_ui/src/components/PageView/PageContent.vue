<template>
    <div class="page-content flex-stretch" ref="refRoot"></div>
</template>

<script lang="ts" setup>
import DefaultPage from './DefaultPage.vue'
import { shallowRef, onMounted, type PropType } from 'vue'
import { ComponentHelper, type Data } from '../../helpers'

// 字段:
const refRoot = shallowRef<HTMLElement | undefined>()

let { component, rootProps } = defineProps({
    component: {
        type: Object,
        default: DefaultPage
    },
    rootProps: {
        type: Object as PropType<Data | null | undefined>,
        default: undefined
    }
})

// 过程:
onMounted(() => {
    if (!refRoot.value) {
        console.warn('The refRoot is undefined!')
        return
    }

    // 创建App:
    const app = ComponentHelper.CreateApp(component ?? DefaultPage, rootProps)

    // 挂载:
    app.mount(refRoot.value)
})
</script>

<style lang="less" scoped></style>