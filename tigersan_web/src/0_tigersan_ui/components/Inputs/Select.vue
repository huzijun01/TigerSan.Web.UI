<template>
    <div class="select" :class="rootClassObj" :style="rootStyleObj" ref="refRoot" @click="OnClick">
        <div class="text" v-if="!isUndefined">{{ model.Text.value }}</div>
        <div class="placeholder" v-if="isUndefined">{{ model.Placeholder }}</div>
        <div class="arrow iconfont" :style="arrowStyleObj">{{ Icons.Arrow_Right }}</div>
    </div>
    <Teleport to="body">
        <div class="select-menu" v-if="model.IsOpen.value" :style="menuStyleObj">
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

// 字段:
let { model } = defineProps({
    model: {
        type: SelectModel,
        default: new SelectModel()
    }
})

const refRoot = ref<HTMLElement | undefined>()
const left = ref(0)
const top = ref(0)

/** 是否未定义: */
let isUndefined = computed(() => model.Value.value === undefined)

/** 根类: */
let rootClassObj = computed(() => {
    return {
        open: model.IsOpen.value,
        disabled: !model.IsEnabled.value
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
    return {
        width: `${model.Width.value}px`,
        maxHeight: `${model.MenuMaxHeight.value}px`,
        left: `${left.value}px`,
        top: `${top.value}px`,
    }
})

// 监听:
var stopWatch = watch(model.IsOpen, isOpen => {
    if (!isOpen) return
    UpdatePosition()
})

// 过程:
onMounted(() => {
    window.addEventListener('resize', UpdatePosition)
})

onUnmounted(() => {
    stopWatch.stop()
    window.removeEventListener('resize', UpdatePosition)
})

// 方法:
function OnClick() {
    if (!model.IsEnabled.value) return
    model.IsOpen.value = !model.IsOpen.value

    if (model.IsOpen.value) {
        document.addEventListener('click', handleClickOutside)
    } else {
        document.removeEventListener('click', handleClickOutside)
    }
}

function UpdatePosition() {
    if (!refRoot.value) {
        console.log('The refRoot is undefined!')
        return
    }

    let rect = refRoot.value.getBoundingClientRect()
    left.value = rect.left
    top.value = rect.bottom
}

// 封装判断函数
function isClickOutside(target: HTMLElement, container: HTMLElement): boolean {
    return !container.contains(target) && target !== container;
}

// 事件处理函数
function handleClickOutside(event: MouseEvent) {
    if (!refRoot.value) {
        console.log('The refRoot is undefined!')
        return
    }

    const target = event.target as HTMLElement

    if (isClickOutside(target, refRoot.value)) {
        model.IsOpen.value = false
    }
}
</script>

<style lang="less" scoped>
@padding: 8px;
@font-size: 14px;
@import '../../assets/styles/input.less';
@import '../../assets/styles/panels.less';

.select {
    .flex-center();
    .input-border();
    /* 文本: */
    cursor: pointer;
    /* 其它: */
    font-size: @font-size;

    &.disabled {
        cursor: default;
        color: var(--color-placeholder-text);
    }

    &.open {
        border-color: var(--color-brand);
    }

    .text {
        flex-grow: 1;
        padding: @padding;
        .ellipsis();
    }

    .placeholder {
        flex-grow: 1;
        padding: @padding;
        color: var(--color-placeholder-text);
        .ellipsis();
    }

    .arrow {
        /* 尺寸: */
        margin-right: @padding;
        /* 颜色: */
        color: var(--color-placeholder-text);
        /* 文本: */
        font-size: @font-size;
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
    border: 1px solid var(--color-brand);
    /* 颜色: */
    background: var(--color-dark-fill);
    /* 其它: */
    z-index: 999;
    /* 动画配置 */
    animation: top-scaleY-animation var(--Global-Animation);

    .menu-item {
        /* 尺寸: */
        padding: 5px 32px 5px 20px;
        font-size: @font-size;
        /* 其它: */
        cursor: pointer;
        .ellipsis();

        &:hover {
            background: var(--color-white-10);
        }
    }
}
</style>