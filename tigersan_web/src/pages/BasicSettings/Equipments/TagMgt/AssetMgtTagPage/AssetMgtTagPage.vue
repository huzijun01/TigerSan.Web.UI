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
                        <span>固件版本:</span>
                        <Select :model="select.firmwareSelect"></Select>
                        <Search :model="select.searchMacAddr"></Search>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button @click="form.Add">+ 导入设备</button>
                        <button @click="BatchOperation">批量操作</button>
                    </div>
                    <div class="row-panel">
                        <button :disabled="!IsOnlySelected" @click="SetParams">修改参数</button>
                        <button :disabled="!IsOnlySelected" @click="SetCol">列管理</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="form.Delete">删除</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="assetMgtTagTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="pagination" :selectedRowCount="assetMgtTagTable.SelectedRowCount.value">
                    <KeyValue :propName="Texts.Online.value" :propValue="onlineCount" :color="Colors.Success">
                    </KeyValue>
                    <KeyValue :propName="Texts.Offline.value" :propValue="offlineCount" :color="Colors.Danger">
                    </KeyValue>
                </Pagination>
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.assetMgtTagForm">
        <FormRow>
            <FormItem :model="form.configMacAddr.ItemModel">
                <input type="text" v-model="form.configMacAddr.Target.value">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import form from './AssetMgtTagForm'
import select from './AssetMgtTagSelect'
import { assetMgtTagTable, pagination, onlineCount, offlineCount } from './AssetMgtTagTable'
import { Texts, dialog, Table, Select, Search, KeyValue, PageCard, Pagination, PopForm, FormRow, FormItem, Colors } from '@/0_tigersan_ui/tigerui'

// 【字段】:
// 表格:
const { IsOnlySelected } = assetMgtTagTable

// 【方法】:
function BatchOperation() {
    dialog.ShowInformation('批量操作')
}


function SetParams() {
    dialog.ShowInformation('修改参数')
}

function SetCol() {
    dialog.ShowInformation('OTA升级')
}
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>