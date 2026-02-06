<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <span>操作类型:</span>
                        <Select :model="operationTypeSelect"></Select>
                        <span>产品类型：</span>
                        <Select :model="productTypeSelect"></Select>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="Refresh">刷新</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="operationRecordTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="paginationModel" :selectedRowCount="operationRecordTable.SelectedRowCount.value">
                </Pagination>
            </div>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import { Int } from '@/0_tigersan_ui/base'
import { dialog } from '@/0_tigersan_ui/stores'
import { operationRecordTable } from './OperationRecordTable'
import { SelectModel, PaginationModel } from '@/0_tigersan_ui/models'
import {
    Table,
    Select,
    PageCard,
    Pagination,
} from '@/0_tigersan_ui/components'
// 【字段】:
// 表格:
const { IsOnlySelected } = operationRecordTable

// 【过程】:
// 选择器:
const operationTypeSelect = new SelectModel()
operationTypeSelect.Width.value = 150
operationTypeSelect.Placeholder.value = '请选择'
operationTypeSelect.Value.value = '全部'
operationTypeSelect.Items.push(...[
    '全部',
    '修改参数',
    '升级',
    '亮灯',
    '恢复出厂',
    '关机',
    '连接状态',
    '参数同步',
    '响铃命令',
    '关灯命令',
    '亮灯&响铃',
    '设备导入',
    '关闭铃声',
    '传感器',
])

const productTypeSelect = new SelectModel()
productTypeSelect.Width.value = 350
productTypeSelect.Placeholder.value = '请选择'
productTypeSelect.Value.value = undefined
productTypeSelect.Items.push(...[
    'MWC03 4G智能工牌',
    'MBT02 可连接资产标签',
    'MBT02 资产中继器',
    'MTB04 5G资产标签',
    'MST03 资产测温标签',
    'MSR01-A 毫米波雷达传感器(人体存在版)',
    'MG8 4G迷你网关',
    'MG5 户外蜂窝网关',
    'MWC04 4G小型融合定位工牌',
    'MST03 光传感器（定制）',
    'MSR01-B 毫米波雷达传感器(人流量版)',
])

// 表格:
operationRecordTable.IsAllowMultiSelect.value = false
operationRecordTable._onInitRowModel = () => {
    paginationModel.Count.value = operationRecordTable.Count.value
}

// 分页器:
let paginationModel = new PaginationModel()
paginationModel.IsShowSelectedRowCount.value = true
paginationModel.Checked = num => {
    // dialog.ShowInformation(`Num = ${num}`)
}

paginationModel.PageSizes.push(new Int(100))

// 【方法】:
function Refresh() {
    operationRecordTable.Refresh()
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