<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <span>基站管理：</span>
                        <Select :model="select.typeSelect"></Select>
                    </div>
                    <div class="row-panel">
                        <span>状态:</span>
                        <Select :model="select.stateSelectModel"></Select>
                        <Search :model="select.searchMac"></Search>
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
            <Table :model="baseStationMgtTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="paginationModel" :selectedRowCount="baseStationMgtTable.SelectedRowCount.value">
                    <KeyValue propName="在线" :propValue="onlineCount" :color="Colors.Success"></KeyValue>
                    <KeyValue propName="离线" :propValue="offlineCount" :color="Colors.Danger"></KeyValue>
                </Pagination>
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.baseStationForm">
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
import form from './BaseStationMgtForm'
import select from './BaseStationMgtSelect'
import { baseStationMgtTable, onlineCount, offlineCount, paginationModel } from './BaseStationMgtTable'
import { dialog, Table, Select, Search, PageCard, Pagination, PopForm, FormRow, FormItem, KeyValue, Colors } from '@/0_tigersan_ui/tigerui'

// 【字段】:
// 表格:
const { IsOnlySelected } = baseStationMgtTable

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
@import '@/assets/page.less';
</style>