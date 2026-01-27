<template>
    <div class="table-item" ref="refRoot">
        <div class="size-panel">
            <div class="size" v-html="formattedText"></div>
            <div class="placeholder">*</div>
        </div>
        <textarea :readonly="model.IsReadonly.value" v-model="model.Text.value" :style="styleObj" @input="OnInput"
            @change="OnChange"></textarea>
    </div>
</template>

<script lang="ts" setup>
import { StringXSS, StringToHtml } from '../../helpers';
import { TableHeaderModel, TableItemModel, TableRowModel } from '../../models';
import { ref, onMounted, computed } from 'vue'

// 字段:
const refRoot = ref<HTMLElement | undefined>()
const actualWidth = ref(50)
const actualHeight = ref(18)

let { model } = defineProps({
    model: {
        type: TableItemModel,
        default: () => new TableItemModel(new TableHeaderModel(''), new TableRowModel({}))
    }
})

let styleObj = computed(() => {
    return {
        width: `${actualWidth.value}px`,
        height: `${actualHeight.value}px`,
    }
})

const formattedText = computed(() => {
    return StringToHtml(model.Text.value)
})

// 过程:
onMounted(() => {
    TextXSS()
    UpdatePagePanelWidth()
    InitResizeObserver()
})

// 方法:
function OnInput() {
    TextXSS()
    model._onItemTextChange()
}

function OnChange() {
}

function TextXSS() {
    model.Text.value = StringXSS(model.Text.value)
}

function InitResizeObserver() {
    if (!refRoot.value) return

    new ResizeObserver(() => {
        UpdatePagePanelWidth()
    }).observe(refRoot.value);
}

function UpdatePagePanelWidth() {
    actualWidth.value = GetWidth()
    actualHeight.value = GetHeight()
}

function GetWidth(): number {
    return (refRoot.value?.offsetWidth ?? 0) + 1
}

function GetHeight(): number {
    return refRoot.value?.offsetHeight ?? 0
}
</script>

<style lang="less" scoped>
.table-item {
    position: relative;

    .size-panel {
        display: flex;

        .size {
            padding: 0 16px;
            color: transparent; // 透明
        }

        .placeholder {
            width: 0;
            overflow: hidden;
        }
    }

    textarea {
        position: absolute;
        top: 0;
        left: 0;
        resize: none;
        /* 保留手动换行符 */
        white-space: pre-wrap;
        /* 禁用自动换行 */
        overflow-wrap: normal;
        overflow: hidden;
    }
}

textarea {
    width: auto;
    min-width: 50px;
    box-sizing: border-box;
    border: 0;
    padding: 0 16px;
    color: white;
    background: transparent;
    outline: none;
    box-shadow: none;
}
</style>