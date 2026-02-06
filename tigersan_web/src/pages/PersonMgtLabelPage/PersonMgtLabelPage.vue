<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <span>产品类型：</span>
                        <Select :model="typeSelect"></Select>
                    </div>
                    <div class="row-panel">
                        <span>在线状态:</span>
                        <Select :model="stateSelect"></Select>
                        <span>蓝牙固件:</span>
                        <Select :model="bluetoothFirmwareSelect"></Select>
                        <input type="text" placeholder="输入IMEI">
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="Refresh">刷新</button>
                        <button @click="Add">+ 导入设备</button>
                    </div>
                    <div class="row-panel">
                        <button :disabled="!IsOnlySelected" @click="Restart">重启</button>
                        <button class="bg-warning" :disabled="!IsOnlySelected" @click="Edit">修改</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="Delete">删除</button>
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
    <PopForm :model="PersonMgtLabelForm">
        <FormRow>
            <FormItem :model="configIMEI.ItemModel">
                <input type="text" :value="configIMEI.Target.value" v-on:input="SetIMEI">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="configEqpName.ItemModel">
                <input type="text" :value="configEqpName.Target.value" v-on:input="SetEqpName">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import { Int } from '@/0_tigersan_ui/base'
import { dialog } from '@/0_tigersan_ui/stores'
import { personMgtLabelTable } from './PersonMgtLabelTable'
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
    configEqpName,
    configIMEI,
    PersonMgtLabelForm,
    SetEqpName,
    SetIMEI,
    Refresh,
    Add,
    Edit,
    Delete,
} from './PersonMgtLabelForm'
// 【字段】:
// 表格:
const { IsOnlySelected } = personMgtLabelTable

// 【过程】:
// 选择框:
const typeSelect = new SelectModel()
typeSelect.Width.value = 300
typeSelect.Placeholder.value = '请选择'
typeSelect.Value.value = 'MWC03 4G智能工牌'
typeSelect.Items.push(...[
    'MWC03 4G智能工牌',
    'MWC04 4G小型融合定位工牌',
])

const stateSelect = new SelectModel()
stateSelect.Width.value = 120
stateSelect.Placeholder.value = '请选择'
stateSelect.Value.value = '全部'
stateSelect.Items.push(...['全部', '在线', '离线'])

const bluetoothFirmwareSelect = new SelectModel()
bluetoothFirmwareSelect.Width.value = 120
bluetoothFirmwareSelect.Value.value = '全部'
bluetoothFirmwareSelect.Items.push(...['全部'])

// 表格:
personMgtLabelTable.IsAllowMultiSelect.value = false
personMgtLabelTable._onInitRowModel = () => {
    paginationModel.Count.value = personMgtLabelTable.Count.value
}

// 分页器:
let paginationModel = new PaginationModel()
paginationModel.IsShowSelectedRowCount.value = true
paginationModel.Checked = num => {
    // dialog.ShowInformation(`Num = ${num}`)
}

paginationModel.PageSizes.push(new Int(100))

// 【方法】:
function SetParams() {
    dialog.ShowInformation('修改参数')
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