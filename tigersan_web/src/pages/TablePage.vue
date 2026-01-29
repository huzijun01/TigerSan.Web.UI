<template>
    <PageCard>
        <div class="table-page">
            <div class="top-panel">
                <div class="filter-panel">
                    <input type="text">
                </div>
                <div class="button-panel">
                    <button @click="WifiUpdate">wifi固件升级</button>
                    <button @click="BluetoothUpdate">蓝牙固件升级</button>
                    <button @click="BatchOperation">批量操作</button>
                    <button @click="Add">+ 新增</button>
                </div>
            </div>
            <Table :model="testTableModel"></Table>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import { Table, PageCard } from '@/0_tigersan_ui/components'
import { testTableModel } from '@/testTableModel'

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
        margin-bottom: 10px;

        &>* {
            // 显示:
            flex-shrink: 0;
        }

        .button-panel {
            // 尺寸:
            padding-left: 10px;

            * {
                margin-right: 5px;
            }
        }
    }
}
</style>