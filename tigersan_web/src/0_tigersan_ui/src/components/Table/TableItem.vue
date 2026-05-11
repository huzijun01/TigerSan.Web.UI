<template>
    <div class="table-item" ref="refRoot">
        <div class="size-panel">
            <div class="size" :class="model.EllipsisClass.value" v-html="formattedText"></div>
            <span class="placeholder">*</span>
        </div>
        <a v-if="model.IsLink.value" class="input ellipsis" :style="inputStyleObj" @click="model.OnClick">
            {{ model.Text.value }}
        </a>
        <input type="text" v-if="model.IsTextBox.value" class="input ellipsis" :style="inputStyleObj"
            :readonly="model.IsReadonly.value" v-model="model.Text.value" @input="OnInput" @change="OnChange" />
        <textarea v-if="model.IsTextarea.value" class="input" :style="inputStyleObj" :readonly="model.IsReadonly.value"
            v-model="model.Text.value" @input="OnInput" @change="OnChange"></textarea>
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

const { model } = defineProps({
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
    return model.IsTextarea.value
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
    return refRoot.value?.getBoundingClientRect().width ?? 0
}

function GetHeight(): number {
    return refRoot.value?.getBoundingClientRect().height ?? 0
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