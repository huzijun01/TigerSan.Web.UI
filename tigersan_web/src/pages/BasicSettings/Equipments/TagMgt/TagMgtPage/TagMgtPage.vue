<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="form.selectState"></Select>
                        <Select :model="form.selectIsEnable"></Select>
                        <Search :model="form.searchTagId"></Search>
                    </div>
                    <div class="row-panel">
                        <Select :model="form.selectBatch"></Select>
                        <Select :model="form.selectType"></Select>
                        <Select :model="form.selectStation"></Select>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button @click="form.Add">+ 新增</button>
                        <button class="bg-warning" :disabled="!IsOnlySelected" @click="form.Edit">修改</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="form.Delete">删除</button>
                    </div>
                    <div class="row-panel">
                        <Switch :model="form.switchIsEnable"></Switch>
                        <button :disabled="!IsOnlySelected" @click="form.Repair">维修</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="tagMgtTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="form.pagination" :selectedRowCount="tagMgtTable.SelectedRowCount.value">
                    <KeyValue :propName="Texts.Online.value" :propValue="form.onlineCount" :color="Colors.Success">
                    </KeyValue>
                    <KeyValue :propName="Texts.Offline.value" :propValue="form.offlineCount" :color="Colors.Danger">
                    </KeyValue>
                </Pagination>
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.tagForm">
        <FormRow>
            <FormItem :model="form.configBatch.ItemModel">
                <Select :model="form.selectBatchForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configType.ItemModel">
                <Select :model="form.selectTypeForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configTagId.ItemModel">
                <input type="text" v-model="form.configTagId.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configBrandId.ItemModel">
                <input type="text" v-model="form.configBrandId.Target.value">
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
import { onMounted, onBeforeUnmount } from 'vue'
import form from './TagMgtForm'
import { tagMgtTable } from './TagMgtTable'
import { Texts, Table, Select, Switch, Search, PageCard, Pagination, PopForm, FormRow, FormItem, KeyValue, Colors, TimerHelper } from '@/0_tigersan_ui/tigerui'

// 【字段】:
// 表格:
const { IsOnlySelected } = tagMgtTable
const timer = new TimerHelper(form.UpdateRowDatas, 10000)

// 【过程】:
onMounted(() => {
    form.Refresh()
    timer.Start()
})

onBeforeUnmount(() => {
    timer.Stop()
})
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>