<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="form.selectCompany"></Select>
                        <Select :model="form.selectScenario"></Select>
                        <Search :model="form.searchBatchId"></Search>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button @click="form.Add">+ 新增</button>
                        <button class="bg-warning" :disabled="!IsOnlySelected" @click="form.Edit">修改</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="form.Delete">删除</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="batchMgtTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="pagination" :selectedRowCount="batchMgtTable.SelectedRowCount.value" />
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.batchMgtForm">
        <FormRow>
            <FormItem :model="form.configCompany.ItemModel">
                <Select :model="form.selectCompanyForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configScenario.ItemModel">
                <Select :model="form.selectScenarioForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configBatchId.ItemModel">
                <input type="text" v-model="form.configBatchId.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configManager.ItemModel">
                <input type="text" v-model="form.configManager.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configPhone.ItemModel">
                <input type="text" v-model="form.configPhone.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configComment.ItemModel">
                <input type="text" v-model="form.configComment.Target.value">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import form from './BatchMgtForm'
import { onMounted } from 'vue'
import { batchMgtTable, pagination } from './BatchMgtTable'
import { Select, Search, Table, PageCard, Pagination, PopForm, FormRow, FormItem, Password } from '@/0_tigersan_ui/tigerui'

// 【字段】:
// 表格:
const { IsOnlySelected } = batchMgtTable

// 【过程】:
onMounted(() => {
    form.Refresh()
})

// 【方法】:
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>