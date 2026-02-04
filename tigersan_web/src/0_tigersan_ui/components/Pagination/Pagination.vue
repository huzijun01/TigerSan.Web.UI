<template>
    <div class="pagination flex-center">
        <div class="select-count" v-if="model.IsShowSelectedRowCount.value">Select: {{ selectedRowCount }}
        </div>
        <div class="count" v-if="model.IsShowCount.value">Count: {{ model.Count.value }}</div>
        <Select v-if="model.IsShowPageSize.value" :model="model.PageSizeSelectModel"></Select>
        <PaginationButton v-for="b in model.ButtonModels" :key="b._id" :model="b"></PaginationButton>
        <div class="page-to flex-center" v-if="model.IsShowPageTextBox.value">
            <span>To</span>
            <input type="text" v-model="model.PageText.value" :style="pageTextStyleObj" @keyup.enter="handleEnter">
            <span>page</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PaginationModel } from '../../models'
import { Select, PaginationButton } from '../../components'
import { computed } from 'vue';

// 字段:
let { model, selectedRowCount } = defineProps({
    model: {
        type: PaginationModel,
        default: new PaginationModel()
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

    .count,
    .select,
    .select-count {
        margin-right: @Gap;
    }

    .page-to {
        margin-left: @Gap;

        input {
            margin: 0 5px;
        }
    }
}
</style>