<template>
    <div class="table-page">
        <!-- 顶部: -->
        <div class="top-panel flex-between">
            <div class="filter-panel">
            </div>
            <div class="button-panel">
                <div class="row-panel">
                    <button class="bg-success" @click="model.Refresh">刷新</button>
                    <button @click="model.Add">+ 新增</button>
                    <button class="bg-warning" :disabled="!IsOnlySelected" @click="model.Edit">修改</button>
                    <button class="bg-danger" :disabled="!IsOnlySelected" @click="model.Delete">删除</button>
                </div>
            </div>
        </div>

        <!-- 表格: -->
        <Table :model="assetRecordTable"></Table>

        <!-- 底部: -->
        <div class="bottom-panel flex-center ">
            <Pagination :model="pagination" :selectedRowCount="assetRecordTable.SelectedRowCount.value" />
        </div>
    </div>

    <!-- 表单: -->
    <PopForm :model="model.assetRecordForm">
        <FormRow>
            <FormItem :model="model.configStation.ItemModel">
                <Select :model="model.selectStationForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="model.configLongitude.ItemModel">
                <input type="text" v-model="model.configLongitude.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="model.configLatitude.ItemModel">
                <input type="text" v-model="model.configLatitude.Target.value">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { AssetRecordPageModel } from './AssetRecordPageModel'
import { assetRecordTable, pagination } from './AssetRecordTable'
import { Select, Table, Pagination, PopForm, FormRow, FormItem } from '@/0_tigersan_ui/tigerui'

const { model } = defineProps({
    model: {
        type: AssetRecordPageModel,
        default: () => new AssetRecordPageModel()
    }
})

// 【字段】:
// 表格:
const { IsOnlySelected } = assetRecordTable

// 【过程】:
onMounted(() => {
    model.Refresh()
})

// 【方法】:
</script>

<style lang="less" scoped>
@import '@/assets/page.less';

.table-page{
    min-height: 55vh;
    max-height: calc(95vh - 160px);
}
</style>