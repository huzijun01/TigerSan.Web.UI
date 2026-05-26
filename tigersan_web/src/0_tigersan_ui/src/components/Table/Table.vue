<template>
    <div class="table-panel" :class="model.ClassObj.value">
        <table>
            <!-- 表头区域 -->
            <thead :style="styleObj">
                <tr>
                    <th v-if="model.IsShowCheckBox.value" class="checkbox">
                        <input v-if="model.IsShowSelectAllCheckBox.value" type="checkbox"
                            v-model="model.IsSelectAll.value" v-on:change="model.RiseOnSelectStateChange">
                    </th>
                    <th v-for="h in model.HeaderModels" :key="h._id" :style="h.styleObj.value">
                        <span class="ellipsis">{{ h.Text.value }}</span>
                    </th>
                </tr>
            </thead>

            <!-- 表格主体 -->
            <tbody>
                <tr v-for="r in model.RowModels" :key="r._id" :class="{ 'select': r.IsChecked.value }">
                    <td v-if="model.IsShowCheckBox.value" class="checkbox">
                        <input type="checkbox" v-model="r.IsChecked.value" v-on:change="model.RiseOnSelectStateChange">
                    </td>
                    <td v-for="i in r.ItemModels" :key="i._id" :style="i._headerModel.styleObj.value">
                        <TableItem type="checkbox" :model="i" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import TableItem from './TableItem.vue';
import { TableModel, TableRowModel } from '../../models'
import { onMounted } from 'vue';

// 字段:
const { model } = defineProps({
    model: {
        type: TableModel<any>,
        default: () => new TableModel([])
    }
})

let styleObj = {
    background: model._headerBackground as any
}

// 过程:
onMounted(() => {
    model.Refresh(true)
})
</script>

<style lang="less" scoped>
@import '../../assets/styles/input.less';
@import '../../assets/styles/panels.less';

.line {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--theme-table-line-background);
    transform: translateY(100%);
}

.table-panel {
    overflow: auto;
    flex-grow: 1;

    table {

        td,
        th {
            color: var(--theme-color);
            padding: 12px 0px;

            &:hover {
                background: var(--theme-mask-hover);
            }
        }

        th.checkbox,
        td.checkbox {
            width: 34px;
            padding: 0px;
        }

        thead {
            /* 位置: */
            position: sticky; // 冻结
            top: 0;
            z-index: 1;

            tr {
                th {
                    span {
                        padding: 0 16px;
                    }
                }

                &::after {
                    .line();
                    height: 2px;
                }
            }
        }

        tbody {
            tr {
                position: relative;

                &::after {
                    .line();
                }
            }
        }
    }

    input[type="checkbox"] {
        cursor: pointer;
        margin: 0 16px;

        &:disabled {
            cursor: default;
        }
    }
}

.table-panel.fill {
    table {
        width: 100%;
    }
}

tr.select {
    background-color: var(--theme-table-row-background-selected);
}
</style>