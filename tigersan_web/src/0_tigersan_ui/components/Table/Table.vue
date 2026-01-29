<template>
    <div class="table-panel">
        <table>
            <!-- 表头区域 -->
            <thead :style="styleObj">
                <tr>
                    <th>
                        <input type="checkbox">
                    </th>
                    <th v-for="h in model.HeaderModels" :key="h._id"><span class="ellipsis">{{ h.Text.value }}</span>
                    </th>
                </tr>
            </thead>

            <!-- 表格主体 -->
            <tbody>
                <tr v-for="r in model.RowModels" :key="r._id">
                    <td>
                        <input type="checkbox">
                    </td>
                    <td v-for="i in r.ItemModels" :key="i._id">
                        <TableItem type="checkbox" :model="i" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import TableItem from './TableItem.vue';
import { TableModel } from '../../models';
import { onMounted } from 'vue';

// 字段:
let { model } = defineProps({
    model: {
        type: TableModel,
        default: () => new TableModel([])
    }
})

let styleObj = {
    background: model._headerBackground as any
}

// 过程:
onMounted(() => {
    model.InitRowModel()
})
</script>

<style lang="less" scoped>
.table-panel {
    overflow: auto;
    flex-grow: 1;

    td,
    th {
        color: var(--color-primary-text);
        padding: 12px 0px;

        &:hover {
            background: var(--color-white-10);
        }
    }

    table {
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

.line {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: white;
    transform: translateY(100%);
}
</style>