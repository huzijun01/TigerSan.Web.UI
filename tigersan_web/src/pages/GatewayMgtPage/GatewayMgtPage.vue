<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <span>网关管理：</span>
                        <Select :model="typeSelect"></Select>
                    </div>
                    <div class="row-panel">
                        <span>状态:</span>
                        <Select :model="stateSelectModel"></Select>
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
                        <button class="bg-success" @click="Refresh">刷新</button>
                        <button @click="Add">+ 新增</button>
                        <button :disabled="!IsOnlySelected" @click="Restart">重启</button>
                        <button class="bg-warning" :disabled="!IsOnlySelected" @click="Edit">修改</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="Delete">删除</button>
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
    <PopForm :model="gatewayForm">
        <FormRow>
            <FormItem :model="configName.ItemModel">
                <input type="text" :value="configName.Target.value" v-on:input="SetName">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="configMacAddr.ItemModel">
                <input type="text" :value="configMacAddr.Target.value" v-on:input="SetMacAddr">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import { Int } from '@/0_tigersan_ui/base'
import { dialog } from '@/0_tigersan_ui/stores'
import { gatewayMgtTable } from './GatewayMgtTable'
import { SelectModel, PaginationModel } from '@/0_tigersan_ui/models'
import {
    Table,
    Select,
    PageCard,
    Pagination,
    PopForm,
    FormRow,
    FormItem
} from '@/0_tigersan_ui/components'
import {
    configName,
    configMacAddr,
    gatewayForm,
    Refresh,
    Add,
    Edit,
    Delete,
    SetName,
    SetMacAddr,
} from './GatewayMgtForm'
// 【字段】:
// 表格:
const { IsOnlySelected } = gatewayMgtTable

// 【过程】:
// 选择框:
const typeSelect = new SelectModel()
typeSelect.Width.value = 300
typeSelect.Placeholder.value = '请选择'
typeSelect.Value.value = 'G1'
typeSelect.Items.push(...['G1', 'MG6', 'MG8 Micro-USB LTE Gateway', 'MG5 Outdoor LTE Gateway'])

const stateSelectModel = new SelectModel()
stateSelectModel.Width.value = 100
stateSelectModel.Value.value = '全部'
stateSelectModel.Items.push(...['全部', '在线', '离线'])

// 表格:
gatewayMgtTable.IsAllowMultiSelect.value = false
gatewayMgtTable._onInitRowModel = () => {
    paginationModel.Count.value = gatewayMgtTable.Count.value
}

// 分页器:
let paginationModel = new PaginationModel()
paginationModel.IsShowSelectedRowCount.value = true
paginationModel.Checked = num => {
    // dialog.ShowInformation(`Num = ${num}`)
}

paginationModel.PageSizes.push(new Int(100))

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
@Gap: 10px;

.child-margin-bottom {
    &>div:not(:last-child) {
        margin-bottom: @Gap;
    }

}

.child-margin-right {
    &>:not(:last-child) {
        margin-right: @Gap;
    }
}

.table-page {
    display: flex;
    flex-direction: column;
    height: 100%; // 必须设置父容器高度

    /* 顶部: */
    .top-panel {
        // 显示:
        overflow: auto;
        flex-shrink: 0;
        // 尺寸:
        margin-bottom: @Gap;

        &>* {
            // 显示:
            flex-shrink: 0;
        }

        .filter-panel {
            .child-margin-bottom();

            .row-panel {
                // 显示:
                display: flex;
                align-items: center;
                .child-margin-right();
            }
        }

        .button-panel {
            // 尺寸:
            padding-left: 20px;
            .child-margin-bottom();

            .row-panel {
                .child-margin-right();
            }
        }
    }

    /* 底部: */
    .bottom-panel {
        // 显示:
        flex-shrink: 0;
        overflow: auto;
    }
}
</style>