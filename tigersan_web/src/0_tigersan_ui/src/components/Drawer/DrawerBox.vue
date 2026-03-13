<template>
    <div class="drawer-box flex-column" :class="model.ClassObj.value">
        <div class="title-panel flex-left" @click="model.OnClick">
            <div class="arrow iconfont">{{ Icons.Arrow_Right }}</div>
            <div class="title">{{ model.Title.value }}</div>
        </div>
        <div class="content-panel" :style="model.ContentPanelStyleObj.value">
            <div class="size-panel" ref="refSizePanel">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { Icons } from '../../base'
import { DrawerBoxModel } from '../../models'

// 字段:
let { model } = defineProps({
    model: {
        type: DrawerBoxModel,
        default: () => new DrawerBoxModel()
    }
})

const { refSizePanel } = model

onMounted(() => {
    model.ObserverSizePanel()
})
</script>

<style lang="less" scoped>
.drawer-box {
    width: 100%;

    &.drawer-box-open {
        .title-panel {
            .arrow {
                transform: rotate(90deg);
            }
        }
    }

    .title-panel {
        padding: 10px 20px;
        border: 1px solid var(--theme-border);
        border-radius: 2px;
        background: var(--theme-panel-background);
        cursor: pointer;

        .arrow {
            margin-right: 10px;
            transition: var(--Global-Transition);
        }
    }
}
</style>