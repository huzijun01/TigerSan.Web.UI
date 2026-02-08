<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <span>产品类型：</span>
                        <Select :model="select.typeSelect"></Select>
                    </div>
                    <div class="row-panel">
                        <span>在线状态:</span>
                        <Select :model="select.stateSelect"></Select>
                        <input type="text" placeholder="输入名称或MAC">
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button @click="form.Add">+ 导入设备</button>
                    </div>
                    <div class="row-panel">
                        <button :disabled="!IsOnlySelected" @click="SetTime">授时</button>
                        <button :disabled="!IsOnlySelected" @click="PowerOff">关机</button>
                        <button :disabled="!IsOnlySelected" @click="OTA_Update">OTA升级</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="form.Delete">删除</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="envSensorTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="paginationModel" :selectedRowCount="envSensorTable.SelectedRowCount.value">
                </Pagination>
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.envSensorForm">
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
    PaginationModel,
} from '@/tigerui'
import form from './EnvSensorForm'
import select from './EnvSensorSelect'
import { envSensorTable } from './EnvSensorTable'
// 【字段】:
// 表格:
const { IsOnlySelected } = envSensorTable

// 【过程】:
// 选择框:


// 表格:
envSensorTable.IsAllowMultiSelect.value = false
envSensorTable._onInitRowModel = () => {
    paginationModel.Count.value = envSensorTable.Count.value
}

// 分页器:
let paginationModel = new PaginationModel()
paginationModel.IsShowSelectedRowCount.value = true

// 【方法】:
function PowerOff() {
    dialog.ShowInformation('关机')
}

function OTA_Update() {
    dialog.ShowInformation('OTA升级')
}

function SetTime() {
    dialog.ShowInformation('授时')
}
</script>

<style lang="less" scoped>
@import '../../assets/page.less';
</style>