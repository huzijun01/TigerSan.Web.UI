<template>
    <div class="table-header" ref="refRoot">
        <span class="ellipsis">{{ model.Text.value }}</span>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { TableHeaderModel, TableModel } from '../../models'

// 字段:
const { model } = defineProps({
    model: {
        type: TableHeaderModel,
        default: () => new TableHeaderModel(new TableModel([]), '')
    }
})

const { refRoot } = model._sizeBehavior

// 过程:
onMounted(() => {
    model._sizeBehavior.Observe()
})
</script>

<style lang="less" scoped>
.table-header {
    padding: 12px 16px;
}
</style>