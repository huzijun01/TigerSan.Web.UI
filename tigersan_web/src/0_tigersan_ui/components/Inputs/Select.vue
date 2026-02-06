<template>
    <div class="select" :class="rootClassObj" :style="rootStyleObj" ref="refRoot" @click="OnClick">
        <div class="text" v-if="!isUndefined">{{ model.Text.value }}</div>
        <div class="placeholder" v-if="isUndefined">{{ model.Placeholder }}</div>
        <div class="arrow iconfont" :style="arrowStyleObj">{{ Icons.Arrow_Right }}</div>
    </div>
    <Teleport to="body">
        <div class="select-menu" v-if="model.IsOpen.value" :class="rootClassObj" :style="menuStyleObj" ref="refMenu">
            <div v-for="i in model.ItemModels.value" :key="i._id">
                <div class="menu-item" v-if="i.IsShow.value" @click="i.OnClick">{{ i.Text.value }}</div>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { Icons } from '../../base';
import { SelectModel } from '../../models';
import { RectPosition, GetWithinWindowRect } from '../../helpers';

// 字段:
let { model } = defineProps({
    model: {
        type: SelectModel,
        default: () => new SelectModel()
    }
})

const refRoot = ref<HTMLElement | undefined>()
const refMenu = ref<HTMLElement | undefined>()
const left = ref(0)
const top = ref(0)
const bottom = ref(0)
const isTopOpen = ref(false)

/** 是否未定义: */
let isUndefined = computed(() => model.Value.value === undefined)

/** 根类: */
let rootClassObj = computed(() => {
    return {
        open: model.IsOpen.value,
        disabled: !model.IsEnabled.value,
        'top-open': isTopOpen.value
    }
})

/** 根样式: */
let rootStyleObj = computed(() => {
    return {
        width: `${model.Width.value}px`
    }
})

/** 箭头样式: */
let arrowStyleObj = computed(() => {
    const arrowAngle = model.IsOpen.value ? -90 : 90
    return {
        transform: `rotate(${arrowAngle}deg)`
    }
})

/** 菜单样式: */
let menuStyleObj = computed(() => {
    let obj = {
        width: `${model.Width.value}px`,
        maxHeight: `${model.MenuMaxHeight.value}px`,
        left: '',
        top: '',
        bottom: '',
    }

    if (isTopOpen.value) {
        obj.left = `${left.value}px`
        obj.bottom = `${bottom.value}px`
    } else {
        obj.left = `${left.value}px`
        obj.top = `${top.value}px`
    }

    return obj
})

// 监听:
const refMenuWatch = watch(refMenu, menu => {
    if (!menu) return
    UpdateMenuPosition()
})

// 过程:
onMounted(() => {
})

onUnmounted(() => {
    refMenuWatch.stop()
    SetEventListener(false)
})

// 方法:
/** 点击后 */
function OnClick() {
    if (!model.IsEnabled.value) return

    model.IsOpen.value = !model.IsOpen.value

    SetEventListener(model.IsOpen.value)
}

/** 设置事件监听 */
function SetEventListener(isAddOrRemove: boolean) {
    if (isAddOrRemove) {
        window.addEventListener('resize', UpdateMenuPosition)
        window.addEventListener('click', window_OnClick)
    } else {
        window.removeEventListener('resize', UpdateMenuPosition)
        window.removeEventListener('click', window_OnClick)
    }
}

/** 更新菜单位置 */
function UpdateMenuPosition() {
    if (!model.IsOpen.value) return

    if (!refRoot.value) {
        console.warn('The refRoot is undefined!')
        return
    }

    if (!refMenu.value) {
        console.warn('The refRoot is undefined!')
        return
    }

    // 基准矩形:
    let rectRoot = refRoot.value.getBoundingClientRect()

    // 菜单矩形:
    let rectMenu = GetWithinWindowRect(rectRoot, refMenu.value.offsetWidth, refMenu.value.offsetHeight)

    // 设置位置:
    isTopOpen.value = rectMenu.Position === RectPosition.Top
    left.value = rectRoot.left
    top.value = rectRoot.bottom
    bottom.value = -rectRoot.top
}

/** 点击窗口后 */
function window_OnClick(event: MouseEvent) {
    if (!refRoot.value) {
        console.warn('The refRoot is undefined!')
        return
    }

    const target = event.target as HTMLElement

    if (IsClickOutside(target, refRoot.value)) {
        model.IsOpen.value = false
    }
}

/** 是否点击外部 */
function IsClickOutside(target: HTMLElement, container: HTMLElement): boolean {
    return !container.contains(target) && target !== container;
}
</script>

<style lang="less" scoped>
@padding: 0 8px;
@font-size: 14px;
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

.select-menu {
    /* 位置: */
    position: absolute;
    /* 显示: */
    overflow: auto;
    /* 尺寸: */
    padding: 5px 0px;
    border-radius: 5px;
    border: 1px solid var(--theme-border-active);
    /* 颜色: */
    background: var(--theme-input-background);
    /* 其它: */
    z-index: 999;
    /* 动画配置 */
    animation: top-scaleY-animation var(--Global-Animation);

    &.top-open {
        /* 动画配置 */
        animation: bottom-scaleY-animation var(--Global-Animation);
    }

    .menu-item {
        /* 尺寸: */
        padding: 5px 32px 5px 20px;
        font-size: @font-size;
        /* 其它: */
        cursor: pointer;
        .ellipsis();

        &:hover {
            background: var(--theme-mask-hover);
        }
    }
}
</style>