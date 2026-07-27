<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="model.selectState" />
                        <Select :model="model.selectIsEnable" />
                        <Search :model="model.searchMacAddr" />
                    </div>
                    <div class="row-panel">
                        <Select :model="model.selectCompany" />
                        <Select :model="model.selectSite" />
                        <Select :model="model.selectType" />
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="model.Refresh">{{ Texts.Refresh.value }}</button>
                        <button v-if="!Authorities.BaseStationMgtPage.IsReadonly.value" @click="model.Add">
                            {{ Texts.Add.value }}</button>
                        <button v-if="!Authorities.BaseStationMgtPage.IsReadonly.value" class="bg-warning"
                            :disabled="!IsOnlySelected" @click="model.Edit">{{ Texts.Edit.value }}</button>
                        <button v-if="!Authorities.BaseStationMgtPage.IsReadonly.value" class="bg-danger"
                            :disabled="!IsOnlySelected" @click="model.Delete">{{ Texts.Delete.value }}</button>
                    </div>
                    <div class="row-panel">
                        <Switch v-if="!Authorities.BaseStationMgtPage.IsReadonly.value" :model="model.switchIsEnable" />
                        <button v-if="!Authorities.BaseStationMgtPage.IsReadonly.value" :disabled="!IsOnlySelected"
                            @click="model.Repair">维修</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="baseStationMgtTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="model.pagination" :selectedRowCount="baseStationMgtTable.SelectedRowCount.value">
                    <KeyValue :propName="Texts.Online.value" :propValue="model.OnlineCount" :color="Colors.Success">
                    </KeyValue>
                    <KeyValue :propName="Texts.Offline.value" :propValue="model.OfflineCount" :color="Colors.Danger">
                    </KeyValue>
                </Pagination>
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="model.form">
        <FormRow>
            <FormItem :model="model.configCompany.ItemModel">
                <Select :model="model.selectCompanyForm" />
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="model.configSite.ItemModel">
                <Select :model="model.selectSiteForm" />
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="model.configType.ItemModel">
                <Select :model="model.selectTypeForm" />
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="model.configName.ItemModel">
                <input type="text" v-model="model.configName.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="model.configMacAddr.ItemModel">
                <input type="text" v-model="model.configMacAddr.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="model.configHeartbeatInterval.ItemModel">
                <input type="text" :placeholder="Texts.Seconds.value"
                    v-model="model.configHeartbeatInterval.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="model.configReportInterval.ItemModel">
                <input type="text" :placeholder="Texts.Seconds.value" v-model="model.configReportInterval.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="model.configImage.ItemModel">
                <Upload :model="model.upload" />
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { Authorities } from '@/navs/Authorities'
import { baseStationMgtTable } from './BaseStationMgtTable'
import { BaseStationMgtPageModel } from './BaseStationMgtPageModel'
import { Texts, Table, Select, Switch, Search, PageCard, Pagination, PopForm, FormRow, FormItem, KeyValue, Colors, Upload } from '@/0_tigersan_ui/tigerui'

// 【字段】:
const model = new BaseStationMgtPageModel()
const { IsOnlySelected } = baseStationMgtTable

// 【过程】:
onMounted(() => {
    model.Refresh()
})
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>