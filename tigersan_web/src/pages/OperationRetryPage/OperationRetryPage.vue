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
                        <input type="text" placeholder="输入MAC地址">
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="Refresh">刷新</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="operationRetryTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="paginationModel" :selectedRowCount="operationRetryTable.SelectedRowCount.value">
                </Pagination>
            </div>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import { Int } from '@/0_tigersan_ui/base'
import { dialog } from '@/0_tigersan_ui/stores'
import { operationRetryTable } from './OperationRetryTable'
import { SelectModel, PaginationModel } from '@/0_tigersan_ui/models'
import {
    Table,
    Select,
    PageCard,
    Pagination,
} from '@/0_tigersan_ui/components'
// 【字段】:
// 表格:
const { IsOnlySelected } = operationRetryTable

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
productTypeSelect.Value.value = 'MBT02可连接资产标签'
productTypeSelect.Items.push(...[
    'MBT02可连接资产标签',
    'MBT02资产中继器',
    'MST03 Light Sensor',
])

// 表格:
operationRetryTable.IsAllowMultiSelect.value = false
operationRetryTable._onInitRowModel = () => {
    paginationModel.Count.value = operationRetryTable.Count.value
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
    operationRetryTable.Refresh()
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