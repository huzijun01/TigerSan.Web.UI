<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="form.filter.selectCompany"></Select>
                        <Select :model="form.filter.selectDepartment"></Select>
                        <Search :model="form.filter.searchAssetId" />
                        <Search :model="form.filter.searchRfid" />
                    </div>
                    <div class="row-panel">
                        <Select :model="form.filter.selectAssetType"></Select>
                        <Select :model="form.filter.selectTagType"></Select>
                        <Select :model="form.filter.selectAssetState"></Select>
                        <Select :model="form.filter.selectOnlineState"></Select>
                        <Select :model="form.filter.selectErrorType"></Select>
                        <Select :model="selectColumnFilter"></Select>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button :disabled="!IsAllowInbound" @click="form.Inbound">
                            {{ Texts.Inbound.value }}
                        </button>
                        <button class="bg-info" :disabled="!IsAllowOutbound" @click="form.Outbound">
                            {{ Texts.Outbound.value }}
                        </button>
                    </div>
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">{{ Texts.Refresh.value }}</button>
                        <button v-if="!Authorities.AssetLedgerPage.IsReadonly.value" @click="form.Add">
                            {{ Texts.Add.value }}</button>
                        <button v-if="!Authorities.AssetLedgerPage.IsReadonly.value" class="bg-warning"
                            :disabled="!IsOnlySelected" @click="form.Edit">{{ Texts.Edit.value }}</button>
                        <button v-if="!Authorities.AssetLedgerPage.IsReadonly.value" class="bg-danger"
                            :disabled="!IsSelected" @click="form.Delete">{{ Texts.Delete.value }}</button>
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
        <TabView :model="tabView" />
    </PopWindow>

    <PopWindow :model="tagDetail">
        <TagDetailPage :tagId="TagId" />
    </PopWindow>
</template>

<script lang="ts" setup>
import TagDetailPage from './TagDetailPage/TagDetailPage.vue'
import { onMounted } from 'vue'
import { Select, Search, Table, PageCard, Pagination, PopForm, FormRow, FormItem, PopWindow, Texts, TabView } from '@/0_tigersan_ui/tigerui'
import { Authorities } from '@/navs/Authorities'
import { AssetLedgerForm } from './AssetLedgerForm'
import { TagId, assetLedgerTable, selectColumnFilter, pagination, assetDetail, tagDetail, IsAllowInbound, IsAllowOutbound, tabView } from './AssetLedgerTable'
// 【字段】:
const form = new AssetLedgerForm()
const { IsOnlySelected, IsSelected } = assetLedgerTable

// 【过程】:
onMounted(() => {
    form.Refresh()
})

// 【方法】:
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>