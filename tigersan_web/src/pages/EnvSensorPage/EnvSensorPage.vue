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
import form from './EnvSensorForm'
import select from './EnvSensorSelect'
import { dialog } from '@/0_tigersan_ui/stores'
import { envSensorTable } from './EnvSensorTable'
import { PaginationModel } from '@/0_tigersan_ui/models'
import {
    Table,
    Select,
    PageCard,
    Pagination,
    PopForm,
    FormRow,
    FormItem
} from '@/0_tigersan_ui/components'
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