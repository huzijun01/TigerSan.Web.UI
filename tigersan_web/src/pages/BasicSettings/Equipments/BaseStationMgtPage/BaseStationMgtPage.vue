<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="form.selectState"></Select>
                        <Select :model="form.selectIsEnable"></Select>
                        <Search :model="form.searchMacAddr"></Search>
                    </div>
                    <div class="row-panel">
                        <Select :model="form.selectCompany"></Select>
                        <Select :model="form.selectSite"></Select>
                        <Select :model="form.selectType"></Select>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button v-if="!Authorities.BaseStationMgtPage.IsReadonly.value" @click="form.Add">+ 新增</button>
                        <button v-if="!Authorities.BaseStationMgtPage.IsReadonly.value" class="bg-warning"
                            :disabled="!IsOnlySelected" @click="form.Edit">修改</button>
                        <button v-if="!Authorities.BaseStationMgtPage.IsReadonly.value" class="bg-danger"
                            :disabled="!IsOnlySelected" @click="form.Delete">删除</button>
                    </div>
                    <div class="row-panel">
                        <Switch v-if="!Authorities.BaseStationMgtPage.IsReadonly.value" :model="form.switchIsEnable" />
                        <button v-if="!Authorities.BaseStationMgtPage.IsReadonly.value" :disabled="!IsOnlySelected"
                            @click="form.Repair">维修</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="baseStationMgtTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="form.pagination" :selectedRowCount="baseStationMgtTable.SelectedRowCount.value">
                    <KeyValue :propName="Texts.Online.value" :propValue="form.onlineCount" :color="Colors.Success">
                    </KeyValue>
                    <KeyValue :propName="Texts.Offline.value" :propValue="form.offlineCount" :color="Colors.Danger">
                    </KeyValue>
                </Pagination>
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.baseStationForm">
        <FormRow>
            <FormItem :model="form.configCompany.ItemModel">
                <Select :model="form.selectCompanyForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configSite.ItemModel">
                <Select :model="form.selectSiteForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configType.ItemModel">
                <Select :model="form.selectTypeForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configName.ItemModel">
                <input type="text" v-model="form.configName.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configMacAddr.ItemModel">
                <input type="text" v-model="form.configMacAddr.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configHeartbeatInterval.ItemModel">
                <input type="text" v-model="form.configHeartbeatInterval.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configReportInterval.ItemModel">
                <input type="text" v-model="form.configReportInterval.Target.value">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { Authorities } from '@/navs/Authorities'
import { baseStationMgtTable } from './BaseStationMgtTable'
import { baseStationMgtForm as form } from './BaseStationMgtForm'
import { Texts, Table, Select, Switch, Search, PageCard, Pagination, PopForm, FormRow, FormItem, KeyValue, Colors, TimerHelper } from '@/0_tigersan_ui/tigerui'

// 【字段】:
// 表格:
const { IsOnlySelected } = baseStationMgtTable

// 【过程】:
onMounted(() => {
    form.Refresh()
})
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>