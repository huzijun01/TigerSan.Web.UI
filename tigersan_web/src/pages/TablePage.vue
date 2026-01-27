<template>
    <div class="table-page">
        <div class="button-panel">
            <button class="refresh" @click="Save">Refresh</button>
            <button class="add" @click="Save">Add</button>
            <button class="delete" @click="Save">Delete</button>
            <button class="edit" @click="Save">Edit</button>
            <button class="save" @click="Save">Save</button>
        </div>
        <Table :model="testTableModel"></Table>
    </div>
</template>

<script lang="ts" setup>
import { Table } from '@/0_tigersan_ui/components'
import { testTableModel } from '@/testTableModel'

function Save() {
    console.log(testTableModel.RowDatas[0])
}
</script>

<style lang="less" scoped>
.table-page {
    padding: 5px;

    .button-panel {
        display: flex;
        padding: 5px;

        * {
            margin-right: 5px;
        }

        .refresh {
            background: var(--color-success);
        }

        .add {
            background: var(--color-warning);
        }

        .delete {
            background: var(--color-danger);
        }

        .edit {
            background: var(--color-info);
        }

        .save {
            background: var(--color-brand);
        }
    }
}
</style>