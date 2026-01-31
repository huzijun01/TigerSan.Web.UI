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
                    <button @click="WifiUpdate">wifi固件升级</button>
                    <button @click="BluetoothUpdate">蓝牙固件升级</button>
                    <button @click="BatchOperation">批量操作</button>
                    <button @click="Add">+ 新增</button>
                </div>
            </div>
            <Table :model="testTableModel"></Table>
            <div class="bottom-panel">
            </div>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import { SelectModel } from '@/0_tigersan_ui/models';
import { Table, Select, PageCard } from '@/0_tigersan_ui/components'
import { testTableModel } from '@/testTableModel'

// 字段:
const typeSelectModel = new SelectModel()
typeSelectModel.Width.value = 300
typeSelectModel.Value.value = 'G1'
typeSelectModel.Items.push(...['G1', 'MG6', 'MG8 Micro-USB LTE Gateway', 'MG5 Outdoor LTE Gateway'])

const stateSelectModel = new SelectModel()
stateSelectModel.Width.value = 100
stateSelectModel.Value.value = '全部'
stateSelectModel.Items.push(...['全部', '在线', '离线'])

// 方法:
function WifiUpdate() {
    console.log(testTableModel.RowDatas[0])
}

function BluetoothUpdate() {
    console.log(testTableModel.RowDatas[0])
}

function BatchOperation() {
    console.log(testTableModel.RowDatas[0])
}

function Add() {
    console.log(testTableModel.RowDatas[0])
}
</script>

<style lang="less" scoped>
@Gap: 10px;

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
            &>div:not(:last-child) {
                margin-bottom: @Gap;
            }

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
            .child-margin-right();
        }
    }
}
</style>