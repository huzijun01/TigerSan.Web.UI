<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <span>网关管理：</span>
                        <Select :model="typeSelectModel"></Select>
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
            <Table :model="testTableModel"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="paginationModel" :selectedRowCount="testTableModel.SelectedRowCount.value">
                </Pagination>
            </div>
        </div>
    </PageCard>
    <GatewayForm :model="formModel"></GatewayForm>
</template>

<script lang="ts" setup>
import { SelectModel, PaginationModel, FormModel, SubmitResult, DialogMode, DialogState } from '@/0_tigersan_ui/models';
import { Table, Select, PageCard, Pagination } from '@/0_tigersan_ui/components'
import { testTableModel } from '@/testTableModel'
import { dialog } from '@/0_tigersan_ui/stores'
import { Colors, Int } from '@/0_tigersan_ui/base'
import GatewayForm from '@/forms/GatewayForm.vue'
import { GatewayModel } from '@/testTableModel'

// 【字段】:
// 表单:
const formModel = new FormModel()
formModel.CancelText.value = '取消'
formModel.SubmitText.value = '确定'

// 表格:
const { IsOnlySelected } = testTableModel

// 【过程】:
// 选择器:
const typeSelectModel = new SelectModel()
typeSelectModel.Width.value = 300
typeSelectModel.Value.value = 'G1'
typeSelectModel.Items.push(...['G1', 'MG6', 'MG8 Micro-USB LTE Gateway', 'MG5 Outdoor LTE Gateway'])

const stateSelectModel = new SelectModel()
stateSelectModel.Width.value = 100
stateSelectModel.Value.value = '全部'
stateSelectModel.Items.push(...['全部', '在线', '离线'])

// 表格:
testTableModel.IsAllowMultiSelect.value = false
testTableModel._onInitRowModel = () => {
    paginationModel.Count.value = testTableModel.Count.value
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

function Refresh() {
    testTableModel.Refresh()
}

function Restart() {
    dialog.ShowInformation('重启')
}

function Add() {
    formModel.Title.value = '新增网关'

    formModel._getSource = () => {
        return new GatewayModel()
    }

    formModel._onSubmit = source => {
        testTableModel.RowDatas.push(source)
        testTableModel.Refresh()

        return new SubmitResult('添加成功')
    }

    formModel.Show()
}

function Edit() {
    formModel.Title.value = '修改网关'

    let index = 0

    formModel._getSource = () => {
        const rowData = testTableModel.SelectedRowDatas.value[0]
        if (!rowData) {
            console.log('The rowData is undefined!')
            return {}
        }

        index = testTableModel.RowDatas.indexOf(rowData)
        return rowData
    }

    formModel._onSubmit = source => {
        testTableModel.RowDatas[index] = source
        testTableModel.Refresh()

        return new SubmitResult('修改成功')
    }

    formModel.Show()
}

function Delete() {
    dialog.ShowDialog('确认', '是否确定删除？', DeleteRowData, DialogMode.YesOrNo, Colors.Warning)
}

function DeleteRowData(state: DialogState) {
    if (state != DialogState.Yes) return

    const rowData = testTableModel.SelectedRowDatas.value[0]
    if (!rowData) {
        console.log('The rowData is undefined!')
        return {}
    }

    testTableModel.RowDatas = testTableModel.RowDatas.filter(r => r != rowData)
    testTableModel.Refresh()

    dialog.ShowSuccess('删除成功')
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