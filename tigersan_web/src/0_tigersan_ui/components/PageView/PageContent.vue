<template>
    <div class="page-content flex-stretch" ref="refRoot" :class="{ 'nav-open': model.NavBarModel.IsOpen.value }"></div>
</template>

<script lang="ts" setup>
import DefaultPage from './DefaultPage.vue'
import { ref, onMounted } from 'vue'
import { CreateApp } from '../../helpers';
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
        console.log('The refRoot is undefined!')
        return
    }

    // 创建App:
    const app = CreateApp(model?._component ?? DefaultPage)

    // 挂载:
    app.mount(refRoot.value)
})
</script>

<style lang="less" scoped></style>