<template>
    <table>
        <!-- 表头区域 -->
        <thead>
            <!-- <tr>
                <th></th>
                <th colspan="2">Process</th>
                <th>Post Meas</th>
            </tr> -->
            <tr>
                <th>
                    <input type="checkbox">
                </th>
                <th v-for="h in model.HeaderModels" :key="h._id"><span class="ellipsis">{{ h.Text.value }}</span></th>
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

// 过程:
onMounted(() => {
    model.InitRowModel()
})
</script>

<style lang="less" scoped>
.line {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: white;
    transform: translateY(100%);
}

table {
    thead {
        tr {
            position: relative;

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
                height: 1px;
            }
        }
    }

    td,
    th {
        color: white;
        padding: 12px 0px;

        &:hover {
            background: var(--color-white-10);
        }
    }

    th {
        span {
            padding: 0 16px;
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
</style>