<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button @click="form.Add">+ 新增</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="form.Delete">删除</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="stationTypeMgtTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="form.pagination" :selectedRowCount="stationTypeMgtTable.SelectedRowCount.value" />
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.stationTypeMgtForm">
        <FormRow>
            <FormItem :model="form.configName.ItemModel">
                <input type="text" v-model="form.configName.Target.value">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import form from './StationTypeMgtForm'
import { onMounted } from 'vue'
import { stationTypeMgtTable } from './StationTypeMgtTable'
import { Table, PageCard, Pagination, PopForm, FormRow, FormItem } from '@/0_tigersan_ui/tigerui'

// 【字段】:
// 表格:
const { IsOnlySelected } = stationTypeMgtTable

// 【过程】:
onMounted(() => {
    form.Refresh()
})

// 【方法】:
</script>

<style lang="less" scoped>
@import '@/assets/page.less';

.readonly-panel {
    margin: 0px 5px 15px 5px;

    .text {
        color: var(--color-warning);
    }
}

.tree-box {
    max-height: 500px;
    overflow: auto;
}
</style>