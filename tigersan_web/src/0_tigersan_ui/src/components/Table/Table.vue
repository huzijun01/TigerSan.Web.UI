<template>
    <div class="table-panel" :class="model.ClassObj.value">
        <table>
            <!-- 表头区域 -->
            <thead :style="bgStyle">
                <tr>
                    <th v-if="model.IsShowCheckBox.value" class="checkbox sticky" ref="refCheckbox" :style="bgStyle">
                        <input v-if="model.IsShowSelectAllCheckBox.value" type="checkbox"
                            v-model="model.IsSelectAll.value" v-on:change="model.RiseOnSelectStateChange">
                    </th>
                    <th v-for="h in model.HeaderModels" :key="h._id" :style="h.CellStyle.value">
                        <TableHeader :model="h" />
                    </th>
                </tr>
            </thead>

            <!-- 表格主体 -->
            <tbody>
                <tr v-for="r in model.RowModels" :key="r._id" :class="r.SelectClass.value">
                    <td v-if="model.IsShowCheckBox.value" class="checkbox sticky" :style="bgStyle">
                        <input type="checkbox" v-model="r.IsChecked.value" v-on:change="model.RiseOnSelectStateChange">
                    </td>
                    <td v-for="i in r.ItemModels" :key="i._id" :style="i._headerModel.CellStyle.value">
                        <TableItem :model="i" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import TableItem from './TableItem.vue'
import TableHeader from './TableHeader.vue'
import { onMounted, type StyleValue } from 'vue'
import { TableModel } from '../../models'

// 字段:
const { model } = defineProps({
    model: {
        type: TableModel<any>,
        default: () => new TableModel([])
    }
})

const { refCheckbox } = model

let bgStyle: StyleValue = {
    background: model._headerBackground as any
}

// 过程:
onMounted(() => {
    model.Refresh(true)
    model._sizeBehavior.Observe()
})
</script>

<style lang="less" scoped>
@import '../../assets/styles/input.less';
@import '../../assets/styles/panels.less';

.sticky {
    position: sticky;
    left: 0;
    z-index: 2;
}

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
        thead {
            /* 位置: */
            position: sticky; // 冻结
            top: 0;
            z-index: 1;

            tr {
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

        td,
        th {
            padding: 0px;
            color: var(--theme-color);

            &:hover {
                background: var(--theme-mask-hover);
            }
        }

        .checkbox {
            width: 34px;

            input {
                margin: 0 16px;
            }
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