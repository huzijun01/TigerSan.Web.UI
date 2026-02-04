<template>
    <div class="page-card flex-stretch">
        <div class="scroll-panel" :style="styleObj">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { Constants } from '../../base';
import { ClassObserver } from '../../helpers';

// 字段:
const isOpen = ref(false)

let { margin, padding, borderRadius, navWidth, topPanelHeight, background } = defineProps({
    margin: {
        type: Number,
        default: 15
    },
    padding: {
        type: Number,
        default: 15
    },
    borderRadius: {
        type: Number,
        default: 10
    },
    navWidth: {
        type: Number,
        default: 200
    },
    topPanelHeight: {
        type: Number,
        default: 36
    },
    background: {
        type: String,
        default: 'var(--theme-background-card)'
    },
})

let styleObj = computed(() => {
    let offsetX = margin * 2
    let offsetY = margin * 2 + topPanelHeight
    if (isOpen.value) {
        offsetX += navWidth
    }

    return {
        margin: `${margin}px`,
        padding: `${padding}px`,
        borderRadius: `${borderRadius}px`,
        width: `calc(100vw - ${offsetX}px)`,
        height: `calc(100vh - ${offsetY}px)`,
        background: background,
    }
})

const bodyClassObserver = new ClassObserver(document.body, UpdateIsOpen)

// 过程:
onMounted(() => {
    UpdateIsOpen(ClassObserver.GetClassList(document.body))
    bodyClassObserver.Start()
})

onBeforeUnmount(() => {
    bodyClassObserver.Stop()
})

// 方法:
function UpdateIsOpen(classes: string[]) {
    isOpen.value = classes.includes(Constants.NavOpen)
}
</script>

<style lang="less" scoped>
.page-card {
    .scroll-panel {
        // 显示:
        overflow: auto;

        &>* {
            width: 100% !important;
        }
    }
}
</style>