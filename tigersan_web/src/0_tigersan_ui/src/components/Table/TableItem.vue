<template>
    <div class="table-item" ref="refRoot">
        <div class="size-panel">
            <div class="size" :class="model.ClassObj.value" v-html="formattedText"></div>
            <span class="placeholder">*</span>
        </div>
        <textarea v-if="model._headerModel.IsAllowWrap.value" class="input" :style="inputStyleObj"
            :readonly="model.IsReadonly.value" v-model="model.Text.value" @input="OnInput"
            @change="OnChange"></textarea>
        <input type="text" v-if="!model._headerModel.IsAllowWrap.value" class="input ellipsis" :style="inputStyleObj"
            :readonly="model.IsReadonly.value" v-model="model.Text.value" @input="OnInput" @change="OnChange"></input>
    </div>
</template>

<script lang="ts" setup>
import { StringHelper } from '../../helpers';
import { TableHeaderModel, TableItemModel, TableModel, TableRowModel } from '../../models'
import { ref, onMounted, computed } from 'vue'

// 字段:
const refRoot = ref<HTMLElement | undefined>()
const actualWidth = ref(50)
const actualHeight = ref(18)

let { model } = defineProps({
    model: {
        type: TableItemModel,
        default: () => new TableItemModel(new TableHeaderModel(new TableModel([]), ''), new TableRowModel(new TableModel([]), {}))
    }
})

const inputStyleObj = computed(() => {
    return {
        width: `${actualWidth.value}px`,
        height: `${actualHeight.value}px`,
        textAlign: model._headerModel.TextAlign.value,
        color: model.Color.value,
        background: model.Background.value,
    }
})

const formattedText = computed(() => {
    return model._headerModel.IsAllowWrap.value
        ? StringHelper.StringToHtml(model.Text.value) :
        StringHelper.StringToHtml(model.Text.value, '')
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
    model.SetRowData()
    model._onItemTextInput()
}

function OnChange() {
    model._onItemTextChange()
}

function TextXSS() {
    model.Text.value = StringHelper.StringXSS(model.Text.value)
}

function InitResizeObserver() {
    if (!refRoot.value) return

    new ResizeObserver(UpdatePagePanelWidth)
        .observe(refRoot.value)
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
@line-height: 1.5;
@input-padding: 0 16px;

.table-item {
    position: relative;

    .size-panel {
        display: flex;

        .size {
            margin: 0;
            padding: @input-padding;
            color: transparent; // 透明
            line-height: @line-height;
        }

        .placeholder {
            width: 0;
            overflow: hidden;
            line-height: @line-height;
        }
    }

    .input {
        /* 位置: */
        position: absolute;
        top: 0;
        left: 0;
        /* 尺寸: */
        width: auto;
        min-width: 50px;
        box-sizing: border-box;
        border: 0;
        padding: @input-padding;
        /* 颜色: */
        outline: none;
        box-shadow: none;
        background: transparent;
        /* 文本: */
        resize: none;
        overflow: hidden;
        white-space: pre-wrap; // 保留手动换行符
        overflow-wrap: normal; // 禁用自动换行
        line-height: @line-height;
    }
}
</style>