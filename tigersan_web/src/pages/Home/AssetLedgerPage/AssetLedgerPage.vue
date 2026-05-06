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
                        <button :disabled="!IsAllowInbound" @click="form.Inbound">入库</button>
                        <button class="bg-info" :disabled="!IsAllowOutbound" @click="form.Outbound">出库</button>
                    </div>
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button v-if="!Authorities.AssetLedgerPage.IsReadonly.value" @click="form.Add">新增</button>
                        <button v-if="!Authorities.AssetLedgerPage.IsReadonly.value" class="bg-warning"
                            :disabled="!IsOnlySelected" @click="form.Edit">修改</button>
                        <button v-if="!Authorities.AssetLedgerPage.IsReadonly.value" class="bg-danger"
                            :disabled="!IsOnlySelected" @click="form.Delete">删除</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="assetLedgerTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="pagination" :selectedRowCount="assetLedgerTable.SelectedRowCount.value" />
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.assetForm">
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

    <!-- 表单（出库）: -->
    <PopForm :model="form.assetOutbundForm">
        <FormRow>
            <FormItem :model="form.configOutboundCompany.ItemModel">
                <Select :model="form.selectCompanyOutboundForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configSite.ItemModel">
                <Select :model="form.selectSiteOutboundForm"></Select>
            </FormItem>
        </FormRow>
    </PopForm>

    <!-- 弹窗 -->
    <PopWindow :model="assetDetail">
        <AssetRecordPage :model="recordPage"></AssetRecordPage>
    </PopWindow>
</template>

<script lang="ts" setup>
import AssetRecordPage from './AssetRecordPage.vue'
import { onMounted } from 'vue'
import { Authorities } from '@/navs/Authorities'
import { assetLedgerForm as form } from './AssetLedgerForm'
import { assetLedgerTable, pagination, assetDetail, recordPage, IsAllowInbound, IsAllowOutbound } from './AssetLedgerTable'
import { Select, Search, Table, PageCard, Pagination, PopForm, FormRow, FormItem, PopWindow } from '@/0_tigersan_ui/tigerui'
// 【字段】:
// 表格:
const { IsOnlySelected } = assetLedgerTable

// 【过程】:
onMounted(() => {
    form.Refresh()
})

// 【方法】:
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>