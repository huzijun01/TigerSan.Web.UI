<template>
    <div class="select" ref="refRoot" :class="model.rootClassObj.value" :style="model.rootStyleObj.value"
        @click="OnClick">
        <div class="text" v-if="!model.isUndefined.value">{{ model.Text.value }}</div>
        <div class="placeholder" v-if="model.isUndefined.value">{{ model.Placeholder }}</div>
        <div class="arrow iconfont" :style="model.arrowStyleObj.value">{{ Icons.Arrow_Right }}</div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Icons } from '../../base'
import { SelectModel } from '../../models'
import { ComponentHelper } from '../../helpers'
import SelectMenu from './SelectMenu.vue'

// 字段:
let { model } = defineProps({
    model: {
        type: SelectModel,
        default: () => new SelectModel()
    }
})

const refRoot = ref<HTMLElement | undefined>()
let panel: Element | undefined

const watchIsOpen = watch(model.IsOpen, (isOpen) => {
    if (isOpen) {
        AddPanel()

        if (SelectModel._appMenu) {
            SelectModel._appMenu.unmount()
            SelectModel._appMenu = undefined
        }

        SelectModel._appMenu = ComponentHelper.CreateApp(SelectMenu, { model })
        SelectModel._appMenu.mount(panel)
    }
})

// 过程:
onMounted(() => {
    model.refRoot.value = refRoot.value
})

onUnmounted(() => {
    watchIsOpen.stop()
    SetEventListener(false)
})

// 方法:
/** 添加容器 */
function AddPanel() {
    const id = `select-menu-panel`
    const dom = document.querySelector(`#${id}`)
    if (dom) {
        panel = dom
    }

    if (!panel) {
        panel = document.createElement('div')
        panel.id = id
        document.body.appendChild(panel)
    }
}

/** 点击后 */
function OnClick() {
    if (!model.IsEnabled.value) return

    model.IsOpen.value = !model.IsOpen.value

    SetEventListener(model.IsOpen.value)
}

/** 设置事件监听 */
function SetEventListener(isAddOrRemove: boolean) {
    if (isAddOrRemove) {
        window.addEventListener('resize', model.UpdateMenuPosition)
        window.addEventListener('click', window_OnClick)
    } else {
        window.removeEventListener('resize', model.UpdateMenuPosition)
        window.removeEventListener('click', window_OnClick)
    }
}

/** 点击窗口后 */
function window_OnClick(event: MouseEvent) {
    if (!model.refRoot.value) {
        console.warn('The refRoot is undefined!')
        return
    }

    const target = event.target as HTMLElement

    if (IsClickOutside(target, model.refRoot.value)) {
        model.IsOpen.value = false
    }
}

/** 是否点击外部 */
function IsClickOutside(target: HTMLElement, panel: HTMLElement): boolean {
    return !panel.contains(target) && target !== panel;
}
</script>

<style lang="less" scoped>
@padding: 0 8px;
@import '../../assets/styles/input.less';

.select {
    /* 显示: */
    display: grid;
    grid-template-columns: 1fr auto;
    .input-border();
    /* 文本: */
    cursor: pointer;

    &.disabled {
        cursor: default;
        color: var(--theme-color-placeholder);
    }

    &.open {
        border-color: var(--theme-border-active);
    }

    .text {
        /* 显示: */
        grid-column: 1/2;
        /* 尺寸: */
        padding: @padding;
        /* 文本: */
        .ellipsis();
    }

    .placeholder {
        /* 显示: */
        grid-column: 1/2;
        /* 尺寸: */
        padding: @padding;
        /* 颜色: */
        color: var(--theme-color-placeholder);
        /* 文本: */
        .ellipsis();
    }

    .arrow {
        /* 显示: */
        grid-column: 2/3;
        /* 尺寸: */
        margin-right: @padding;
        /* 颜色: */
        color: var(--theme-color-placeholder);
        /* 过渡: */
        transition: var(--Global-Transition);
    }
}
</style>