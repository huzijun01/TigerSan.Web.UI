<template>
    <PageCard>
        <div class="table-page">
            <div class="top-panel">
                <div class="filter-panel">
                    <div class="row-panel">
                        <span>网关管理：</span>
                        <Select :model="typeSelectModel"></Select>
                    </div>
                    <div class="row-panel">
                        <span>状态:</span>
                        <Select :model="stateSelectModel"></Select>
                        <input type="text">
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button @click="WifiUpdate">wifi固件升级</button>
                        <button @click="BluetoothUpdate">蓝牙固件升级</button>
                        <button @click="BatchOperation">批量操作</button>
                    </div>
                    <div class="row-panel">
                        <button @click="Refresh">刷新</button>
                        <button @click="Refresh">重启</button>
                        <button @click="Add">+ 新增</button>
                        <button @click="Edit">修改</button>
                        <button @click="Delete">- 删除</button>
                    </div>
                </div>
            </div>
            <Table :model="testTableModel"></Table>
            <div class="bottom-panel">
                <Pagination :model="paginationModel"></Pagination>
            </div>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import { SelectModel, PaginationModel } from '@/0_tigersan_ui/models';
import { Table, Select, PageCard, Pagination } from '@/0_tigersan_ui/components'
import { testTableModel } from '@/testTableModel'
import { dialog } from '@/0_tigersan_ui/stores';
import { Int } from '@/0_tigersan_ui/base/types';

// 字段:
const typeSelectModel = new SelectModel()
typeSelectModel.Width.value = 300
typeSelectModel.Value.value = 'G1'
typeSelectModel.Items.push(...['G1', 'MG6', 'MG8 Micro-USB LTE Gateway', 'MG5 Outdoor LTE Gateway'])

const stateSelectModel = new SelectModel()
stateSelectModel.Width.value = 100
stateSelectModel.Value.value = '全部'
stateSelectModel.Items.push(...['全部', '在线', '离线'])

let paginationModel = new PaginationModel()
paginationModel.Count.value = 81
paginationModel.Checked = num => {
    // dialog.ShowInformation(`Num = ${num}`)
}

paginationModel.PageSizes.push(new Int(100))

// 方法:
function WifiUpdate() {
}

function BluetoothUpdate() {
}

function BatchOperation() {
}

function Refresh() {
}

function Add() {
    ++paginationModel.Count.value
}

function Edit() {
}

function Delete() {
    --paginationModel.Count.value
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

    .top-panel {
        // 显示:
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between; // 两端对齐
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

        .bottom-panel {
            // 显示:
            flex-shrink: 0;
            overflow: auto;
        }
    }
}
</style>