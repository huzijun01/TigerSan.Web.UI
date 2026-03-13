<template>
    <div class="select" ref="refRoot" :class="model.rootClass.value" :style="model.widthStyle.value" @click="OnClick">
        <input type="text" ref="refInput" v-model="model.Text.value" :placeholder="model.Placeholder.value"
            :disabled="!model.IsEnabled.value">
        <div class="button-panel flex-center">
            <div class="arrow iconfont" :style="model.arrowStyleObj.value">{{ Icons.Arrow_Right }}</div>
        </div>
        <div class="mask" v-if="!model.IsAllowSearch.value"></div>
    </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, onUnmounted } from 'vue'
import { Icons } from '../../base'
import { SelectModel } from '../../models'
import { ComponentHelper } from '../../helpers'
import SelectMenu from './SelectMenu.vue'

// 字段:
const { model } = defineProps({
    model: {
        type: SelectModel,
        default: () => new SelectModel()
    }
})

const { refRoot, refInput } = model

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
    if (!refInput.value) {
        console.warn('The refInput is undefined!')
        return
    }

    if (!model.IsEnabled.value) return

    if (!model.IsOpen.value) {
        model.IsOpen.value = true
    } else if (refInput.value != document.activeElement) {
        model.IsOpen.value = false
    }

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
@size: 16px;

.select {
    position: relative;

    &.open input {
        border-color: var(--color-brand);
    }

    &>input {
        width: 100%;
        padding-right: 31px;
    }

    .button-panel {
        position: absolute;
        top: 0px;
        right: 0px;
        height: 100%;

        .arrow {
            width: @size;
            height: @size;
            font-size: @size;
            line-height: 1;
            cursor: pointer;
            margin-right: 10px;
            color: var(--color-placeholder-text);
            /* 过渡: */
            transition: var(--Global-Transition);
        }
    }

    .mask {
        position: absolute;
        top: 0px;
        right: 0px;
        height: 100%;
        width: 100%;
        cursor: pointer;
    }
}
</style>