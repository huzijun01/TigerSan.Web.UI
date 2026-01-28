<template>
    <div class="table-page flex-stretch">
        <div class="card">
            <div class="top-panel" :style="styleObject">
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
            <div class="table-panel" :style="styleObject">
                <Table :model="testTableModel"></Table>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Table } from '@/0_tigersan_ui/components'
import navBarModel from '@/navBarModel';
import { testTableModel } from '@/testTableModel'
import { computed } from 'vue';

let styleObject = computed(() => {
    return {
        width: `calc(100vw - ${navBarModel.IsOpen.value ? navBarModel.Width.value : 0}px)`
    }
})

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
@nav-width: 200px;
@card-margin: 15px;
@card-padding: 15px;
@card-width: 100vw - @card-margin * 2 - @card-padding * 2;
@panel-padding: 10px;

.card {
    width: calc(@card-width);
    border-radius: 10px;

    &>* {
        width: 100% !important;
    }
}

.nav-open {
    .card {
        width: calc(@card-width - @nav-width);
    }
}

.table-page {
    .card {
        // 显示:
        overflow: auto;
        // 尺寸:
        margin: @card-margin;
        padding: @card-padding;
        // 颜色:
        background: var(--color-black-25);

        .top-panel {
            // 显示:
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: space-between; // 两端对齐
            overflow: auto;

            .button-panel {
                // 显示:
                flex-shrink: 0;
                // 尺寸:
                padding-left: 10px;

                * {
                    margin-right: 5px;
                }
            }
        }

        .table-panel {
            overflow: auto;
        }
    }
}
</style>