<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <span>网关管理：</span>
                        <Select :model="select.typeSelect"></Select>
                    </div>
                    <div class="row-panel">
                        <span>状态:</span>
                        <Select :model="select.stateSelectModel"></Select>
                        <input type="text" placeholder="输入名称或MAC">
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button @click="BatchOperation">批量操作</button>
                        <button :disabled="!IsOnlySelected" @click="WifiUpdate">WiFi固件升级</button>
                        <button :disabled="!IsOnlySelected" @click="BluetoothUpdate">蓝牙固件升级</button>
                    </div>
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button @click="form.Add">+ 新增</button>
                        <button :disabled="!IsOnlySelected" @click="Restart">重启</button>
                        <button class="bg-warning" :disabled="!IsOnlySelected" @click="form.Edit">修改</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="form.Delete">删除</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="gatewayMgtTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="paginationModel" :selectedRowCount="gatewayMgtTable.SelectedRowCount.value">
                </Pagination>
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.gatewayForm">
        <FormRow>
            <FormItem :model="form.configName.ItemModel">
                <input type="text" v-model="form.configName.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configMacAddr.ItemModel">
                <input type="text" v-model="form.configMacAddr.Target.value">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import {
    dialog,
    Table,
    Select,
    PageCard,
    Pagination,
    PopForm,
    FormRow,
    FormItem,
    PaginationModel
} from '@/tigerui'
import form from './GatewayMgtForm'
import select from './GatewayMgtSelect'
import { gatewayMgtTable } from './GatewayMgtTable'
// 【字段】:
// 表格:
const { IsOnlySelected } = gatewayMgtTable

// 【过程】:
// 表格:
gatewayMgtTable.IsAllowMultiSelect.value = false
gatewayMgtTable._onInitRowModel = () => {
    paginationModel.Count.value = gatewayMgtTable.Count.value
}

// 分页器:
let paginationModel = new PaginationModel()
paginationModel.IsShowSelectedRowCount.value = true

// 【方法】:
function BatchOperation() {
    dialog.ShowInformation('批量操作')
}

function WifiUpdate() {
    dialog.ShowInformation('WiFi固件升级')
}

function BluetoothUpdate() {
    dialog.ShowInformation('蓝牙固件升级')
}

function Restart() {
    dialog.ShowInformation('重启')
}
</script>

<style lang="less" scoped>
@import '../../assets/page.less';
</style>