<template>
    <div class="pagination flex-center">
        <slot></slot>
        <KeyValue :name="Texts.Select" :value="selectedRowCount" v-if="model.IsShowSelectedRowCount.value"></KeyValue>
        <KeyValue :name="Texts.Count" :value="model.Count.value" v-if="model.IsShowCount.value"></KeyValue>
        <Select v-if="model.IsShowPageSize.value" :model="model.PageSizeSelectModel"></Select>
        <PaginationButton v-for="b in model.ButtonModels" :key="b._id" :model="b"></PaginationButton>
        <div class="page-to flex-center" v-if="model.IsShowPageTextBox.value">
            <span>{{ Texts.To }}</span>
            <input type="text" v-model="model.PageText.value" :style="pageTextStyleObj" @keyup.enter="handleEnter">
            <span>{{ Texts.page }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Texts } from '../../text'
import { PaginationModel } from '../../models'
import { Select, PaginationButton, KeyValue } from '../../components'

// 字段:
let { model, selectedRowCount } = defineProps({
    model: {
        type: PaginationModel,
        default: () => new PaginationModel()
    },
    selectedRowCount: {
        type: Number,
        default: 0
    }
})

const pageTextStyleObj = computed(() => {
    return {
        width: `${model.PageTextWidth.value}px`
    }
})

// 方法:
function handleEnter(e: KeyboardEvent) {
    e.preventDefault()
    model.GoToPage()
}
</script>

<style lang="less" scoped>
@Gap: 10px;

.pagination {
    .page-to {
        margin-left: @Gap;

        input {
            margin: 0 5px;
        }
    }
}
</style>