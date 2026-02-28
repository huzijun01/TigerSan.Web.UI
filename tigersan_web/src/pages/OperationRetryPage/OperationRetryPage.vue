<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <span>操作类型:</span>
                        <Select :model="select.operationTypeSelect"></Select>
                        <span>设备类型：</span>
                        <Select :model="select.eqpTypeSelect"></Select>
                    </div>
                    <div class="row-panel">
                        <Search :model="select.searchMac"></Search>
                        <DatePicker :model="select.date"></DatePicker>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="Refresh">刷新</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="operationRetryTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="paginationModel" :selectedRowCount="operationRetryTable.SelectedRowCount.value">
                </Pagination>
            </div>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import select from './OperationRetrySelect'
import { operationRetryTable } from './OperationRetryTable'
import { Table, Select, PageCard, Pagination, PaginationModel, DatePicker, Search } from '@/0_tigersan_ui/tigerui'
// 【字段】:
// 表格:
const { IsOnlySelected } = operationRetryTable

// 【过程】:
// 表格:
operationRetryTable.IsAllowMultiSelect.value = false
operationRetryTable._onInitRowModel = () => {
    paginationModel.Count.value = operationRetryTable.Count.value
}

// 分页器:
let paginationModel = new PaginationModel()
paginationModel.IsShowSelectedRowCount.value = true

// 【方法】:
function Refresh() {
    operationRetryTable.Refresh()
}
</script>

<style lang="less" scoped>
@import '../../assets/page.less';
</style>