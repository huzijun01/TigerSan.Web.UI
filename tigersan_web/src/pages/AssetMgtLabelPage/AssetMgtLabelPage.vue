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
                        <span>固件版本:</span>
                        <Select :model="firmwareSelect"></Select>
                        <input type="text" placeholder="输入名称或MAC">
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="Refresh">刷新</button>
                        <button @click="Add">+ 导入设备</button>
                        <button @click="BatchOperation">批量操作</button>
                    </div>
                    <div class="row-panel">
                        <button :disabled="!IsOnlySelected" @click="SetParams">修改参数</button>
                        <button :disabled="!IsOnlySelected" @click="SetCol">列管理</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="Delete">删除</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="assetMgtLabelTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="paginationModel" :selectedRowCount="assetMgtLabelTable.SelectedRowCount.value">
                </Pagination>
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="AssetMgtLabelForm">
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
import { assetMgtLabelTable } from './AssetMgtLabelTable'
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
    configMacAddr,
    AssetMgtLabelForm,
    SetMacAddr,
    Refresh,
    Add,
    Delete,
} from './AssetMgtLabelForm'
// 【字段】:
// 表格:
const { IsOnlySelected } = assetMgtLabelTable

// 【过程】:
// 选择器:
const typeSelect = new SelectModel()
typeSelect.Width.value = 300
typeSelect.Placeholder.value = '请选择'
typeSelect.Value.value = 'MBT02 可连接资产标签'
typeSelect.Items.push(...[
    'MBT02 可连接资产标签',
    'MBT02 资产中继器',
    'MTB04 5G资产标签',
])

const stateSelect = new SelectModel()
stateSelect.Width.value = 100
stateSelect.Value.value = '全部'
stateSelect.Items.push(...['全部', '在线', '离线'])

const firmwareSelect = new SelectModel()
firmwareSelect.Width.value = 100
firmwareSelect.Value.value = '全部'
firmwareSelect.Items.push(...[
    '全部',
    '3.2.0'
])

// 表格:
assetMgtLabelTable.IsAllowMultiSelect.value = false
assetMgtLabelTable._onInitRowModel = () => {
    paginationModel.Count.value = assetMgtLabelTable.Count.value
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


function SetParams() {
    dialog.ShowInformation('修改参数')
}

function SetCol() {
    dialog.ShowInformation('OTA升级')
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