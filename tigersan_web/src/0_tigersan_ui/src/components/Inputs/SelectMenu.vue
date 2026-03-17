<template>
    <div class="select-menu" ref="refMenu" v-if="model.IsOpen.value" :class="model.rootClass.value"
        :style="model.menuStyleObj.value">
        <div v-for="i in model.ItemModels.value" :key="i._id">
            <div class="menu-item" v-if="i.IsShow.value" @click="i.OnClick">{{ i.Text.value }}</div>
        </div>
        <div v-if="model.IsNoContent.value" class="placeholder flex-center">{{ Texts.NoContent.value }}</div>
    </div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref, watch } from 'vue';
import { Texts } from '../../texts'
import { SelectModel } from '../../models'

// 字段:
let { model } = defineProps({
    model: {
        type: SelectModel,
        default: () => new SelectModel()
    }
})

const refMenu = ref<HTMLElement | undefined>()

// 监听:
const refMenuWatch = watch(refMenu, menu => {
    if (!menu) return
    model.refMenu.value = refMenu.value
    model.UpdateMenuPosition()
})

// 过程:
onUnmounted(() => {
    refMenuWatch.stop()
})
</script>

<style lang="less" scoped>
@import '../../assets/styles/input.less';

@font-size: 14px;

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

    .placeholder {
        padding: 5px;
        color: var(--theme-color-placeholder);
    }
}
</style>