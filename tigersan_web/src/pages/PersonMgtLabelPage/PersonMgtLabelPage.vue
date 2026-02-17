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
                        <span>蓝牙固件:</span>
                        <Select :model="select.bluetoothFirmwareSelect"></Select>
                        <input type="text" placeholder="输入IMEI">
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button @click="form.Add">+ 导入设备</button>
                    </div>
                    <div class="row-panel">
                        <button :disabled="!IsOnlySelected" @click="Restart">重启</button>
                        <button class="bg-warning" :disabled="!IsOnlySelected" @click="form.Edit">修改</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="form.Delete">删除</button>
                        <button :disabled="!IsOnlySelected" @click="SetParams">修改参数</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="personMgtLabelTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="paginationModel" :selectedRowCount="personMgtLabelTable.SelectedRowCount.value">
                </Pagination>
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.personMgtLabelForm">
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
import {
    Table,
    Select,
    PageCard,
    Pagination,
    PopForm,
    FormRow,
    dialog,
    FormItem,
    PaginationModel,
} from '@/0_tigersan_ui/tigerui'
import form from './PersonMgtLabelForm'
import select from './PersonMgtLabelSelect'
import { personMgtLabelTable } from './PersonMgtLabelTable'
// 【字段】:
// 表格:
const { IsOnlySelected } = personMgtLabelTable

// 【过程】:
// 表格:
personMgtLabelTable.IsAllowMultiSelect.value = false
personMgtLabelTable._onInitRowModel = () => {
    paginationModel.Count.value = personMgtLabelTable.Count.value
}

// 分页器:
let paginationModel = new PaginationModel()
paginationModel.IsShowSelectedRowCount.value = true

// 【方法】:
function SetParams() {
    dialog.ShowInformation('修改参数')
}

function Restart() {
    dialog.ShowInformation('重启')
}
</script>

<style lang="less" scoped>
@import '../../assets/page.less';
</style>