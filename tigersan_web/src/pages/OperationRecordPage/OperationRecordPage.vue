<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <span>操作类型:</span>
                        <Select :model="select.operationTypeSelect"></Select>
                        <span>产品类型：</span>
                        <Select :model="select.productTypeSelect"></Select>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="Refresh">刷新</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="operationRecordTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="paginationModel" :selectedRowCount="operationRecordTable.SelectedRowCount.value">
                </Pagination>
            </div>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import {
    Table,
    Select,
    PageCard,
    Pagination,
    PaginationModel,
} from '@/0_tigersan_ui/tigerui'
import select from './OperationRecordSelect'
import { operationRecordTable } from './OperationRecordTable'
// 【字段】:

// 【过程】:
// 表格:
operationRecordTable.IsAllowMultiSelect.value = false
operationRecordTable._onInitRowModel = () => {
    paginationModel.Count.value = operationRecordTable.Count.value
}

// 分页器:
let paginationModel = new PaginationModel()
paginationModel.IsShowSelectedRowCount.value = true

// 【方法】:
function Refresh() {
    operationRecordTable.Refresh()
}
</script>

<style lang="less" scoped>
@import '../../assets/page.less';
</style>