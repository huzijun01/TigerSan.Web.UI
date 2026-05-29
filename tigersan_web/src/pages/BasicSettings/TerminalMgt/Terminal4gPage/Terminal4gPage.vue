<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <span>设备类型：</span>
                        <Select :model="select.typeSelect"></Select>
                    </div>
                    <div class="row-panel">
                        <span>在线状态:</span>
                        <Select :model="select.selectState"></Select>
                        <span>蓝牙固件:</span>
                        <Select :model="select.bluetoothFirmwareSelect"></Select>
                        <Search :model="select.searchIMEI"></Search>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">{{ Texts.Refresh.value }}</button>
                        <button @click="form.Add">+ 导入设备</button>
                    </div>
                    <div class="row-panel">
                        <button :disabled="!IsOnlySelected" @click="Restart">重启</button>
                        <button class="bg-warning" :disabled="!IsOnlySelected" @click="form.Edit">{{ Texts.Edit.value }}</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="form.Delete">{{ Texts.Delete.value }}</button>
                        <button :disabled="!IsOnlySelected" @click="SetParams">修改参数</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="terminal4gTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="pagination" :selectedRowCount="terminal4gTable.SelectedRowCount.value">
                    <KeyValue :propName="Texts.Online.value" :propValue="onlineCount" :color="Colors.Success"></KeyValue>
                    <KeyValue :propName="Texts.Offline.value" :propValue="offlineCount" :color="Colors.Danger"></KeyValue>
                </Pagination>
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.terminal4gForm">
        <FormRow>
            <FormItem :model="form.configIMEI.ItemModel">
                <input type="text" v-model="form.configIMEI.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configEqpName.ItemModel">
                <input type="text" v-model="form.configEqpName.Target.value">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import form from './Terminal4gForm'
import select from './Terminal4gSelect'
import { terminal4gTable, onlineCount, offlineCount, pagination } from './Terminal4gTable'
import { DialogHelper, Table, Select, Search, PageCard, Pagination, PopForm, FormRow, FormItem, KeyValue, Colors, Texts } from '@/0_tigersan_ui/tigerui'

// 【字段】:
// 表格:
const { IsOnlySelected } = terminal4gTable

// 【方法】:
function SetParams() {
    DialogHelper.ShowInformation('修改参数')
}

function Restart() {
    DialogHelper.ShowInformation('重启')
}
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>