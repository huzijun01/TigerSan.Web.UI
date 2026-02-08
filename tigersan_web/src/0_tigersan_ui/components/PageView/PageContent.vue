<template>
    <div class="page-content flex-stretch" ref="refRoot"></div>
</template>

<script lang="ts" setup>
import DefaultPage from './DefaultPage.vue'
import { ref, onMounted } from 'vue'
import { ComponentHelper } from '../../helpers';
import { NavBarModel, NavButtonModel } from '../../models'

// 字段:
const refRoot = ref<HTMLElement | undefined>()

let { model } = defineProps({
    model: {
        type: NavButtonModel,
        default: NavBarModel._defaultButtonModel
    }
})

// 过程:
onMounted(() => {
    if (!refRoot.value) {
        console.warn('The refRoot is undefined!')
        return
    }

    // 创建App:
    const app = ComponentHelper.CreateApp(model?._component ?? DefaultPage)

    // 挂载:
    app.mount(refRoot.value)
})
</script>

<style lang="less" scoped></style>