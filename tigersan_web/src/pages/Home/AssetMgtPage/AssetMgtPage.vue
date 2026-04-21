<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="form.selectCompany"></Select>
                        <Select :model="form.selectDepartment"></Select>
                        <Select :model="form.selectAssetState"></Select>
                    </div>
                    <div class="row-panel">
                        <Select :model="form.selectAssetType"></Select>
                        <Search :model="form.searchAssetId"></Search>
                        <Select :model="form.selectOnlineState"></Select>
                        <Select :model="form.selectErrorType"></Select>
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
            <Table :model="assetMgtTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="pagination" :selectedRowCount="assetMgtTable.SelectedRowCount.value" />
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.assetMgtForm">
        <FormRow>
            <FormItem :model="form.configCompany.ItemModel">
                <Select :model="form.selectCompanyForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configDepartment.ItemModel">
                <Select :model="form.selectDepartmentForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configAssetType.ItemModel">
                <Select :model="form.selectAssetTypeForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configAssetId.ItemModel">
                <input type="text" v-model="form.configAssetId.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configTagId.ItemModel">
                <input type="text" v-model="form.configTagId.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configName.ItemModel">
                <input type="text" v-model="form.configName.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configComment.ItemModel">
                <input type="text" v-model="form.configComment.Target.value">
            </FormItem>
        </FormRow>
    </PopForm>

    <!-- 弹窗 -->
    <PopWindow :model="assetDetail">
        <AssetRecordPage :model="recordPage"></AssetRecordPage>
    </PopWindow>
</template>

<script lang="ts" setup>
import form from './AssetMgtForm'
import AssetRecordPage from './AssetRecordPage.vue'
import { onMounted } from 'vue'
import { assetMgtTable, pagination, assetDetail, recordPage } from './AssetMgtTable'
import { Select, Search, Table, PageCard, Pagination, PopForm, FormRow, FormItem, PopWindow } from '@/0_tigersan_ui/tigerui'
// 【字段】:
// 表格:
const { IsOnlySelected } = assetMgtTable

// 【过程】:
onMounted(() => {
    form.Refresh()
})

// 【方法】:
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>