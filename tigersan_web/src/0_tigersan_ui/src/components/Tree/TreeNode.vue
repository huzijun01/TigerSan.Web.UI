<template>
    <div class="tree-node-panel" :class="model.rootClass.value">
        <div class="back-panel flex-center">
            <Arrow :isShow="model.IsHaveChild.value" :style="model.arrowStyleObj.value" :click="model.OnClickArrow" />
            <input type="checkbox" class="checkbox" v-if="model._tree.IsShowCheckbox.value"
                v-model="model.IsChecked.value" @change="model.OnChange">
            <div class="text" @click="model.OnClick">{{ model.Text.value }}</div>
        </div>
        <div class="content-panel flex-center drawer" :style="model.ContentPanelStyleObj.value">
            <Arrow v-if="model.IsHaveChild.value" :opacity="0" />
            <div class="size-panel" ref="refSizePanel">
                <TreeNode v-for="c in model.Childs" :key="c._id" :model="c" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Arrow from './Arrow.vue'
import { onMounted } from 'vue'
import { TreeModel, TreeNodeModel } from '../../models'

// 字段:
const { model } = defineProps({
    model: {
        type: TreeNodeModel,
        default: () => new TreeNodeModel(new TreeModel())
    }
})

const { refSizePanel } = model

onMounted(() => {
    model.ObserverSizePanel()
})
</script>

<style lang="less" scoped>
.tree-node-panel {
    display: grid;
    grid-template-rows: fit-content(100%) fit-content(100%);

    &.active {
        &>.back-panel {
            background: var(--theme-tree-node-background-active) !important;

            .text {
                font-weight: bold;
                color: var(--theme-brand);
            }
        }
    }

    .back-panel {
        align-items: center;
        border-radius: 5px;
        cursor: pointer;
        transition: var(--Global-Transition);

        &:hover {
            background: var(--theme-mask-hover);
        }

        .checkbox {
            margin-right: 8px;
        }

        .text {
            flex-grow: 1;
            padding: 5px 0px;
            text-wrap: nowrap;
            transition: var(--Global-Transition);
        }
    }

    .content-panel {
        .size-panel {
            flex-grow: 1;
        }
    }
}
</style>
