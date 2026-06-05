<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="form.selectBatch"></Select>
                        <Select :model="form.selectTagType"></Select>
                        <Select :model="form.selectStation"></Select>
                    </div>
                    <div class="row-panel">
                        <Search :model="form.searchTagId"></Search>
                        <Search :model="form.searchRfid"></Search>
                        <Select :model="form.selectState"></Select>
                        <Select :model="form.selectIsEnable"></Select>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">{{ Texts.Refresh.value }}</button>
                        <button v-if="!Authorities.TagMgtPage.IsReadonly.value" @click="form.Add">
                            {{ Texts.Add.value }}
                        </button>
                        <button v-if="!Authorities.TagMgtPage.IsReadonly.value" class="bg-warning"
                            :disabled="!IsOnlySelected" @click="form.Edit">{{ Texts.Edit.value }}</button>
                        <button v-if="!Authorities.TagMgtPage.IsReadonly.value" class="bg-danger"
                            :disabled="!IsOnlySelected" @click="form.Delete">{{ Texts.Delete.value }}</button>
                    </div>
                    <div class="row-panel">
                        <Switch :model="form.switchIsEnable"></Switch>
                        <button :disabled="!IsOnlySelected" @click="form.Repair">维修</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="form.table"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="form.pagination" :selectedRowCount="form.table.SelectedRowCount.value">
                    <KeyValue :propName="Texts.Online.value" :propValue="form.OnlineCount" :color="Colors.Success">
                    </KeyValue>
                    <KeyValue :propName="Texts.Offline.value" :propValue="form.OfflineCount" :color="Colors.Danger">
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
                <Select :model="form.selectTagTypeForm"></Select>
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
            <FormItem :model="form.configRFID.ItemModel">
                <input type="text" v-model="form.configRFID.Target.value">
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
import { onMounted } from 'vue'
import { Texts, Table, Select, Switch, Search, PageCard, Pagination, PopForm, FormRow, FormItem, KeyValue, Colors } from '@/0_tigersan_ui/tigerui'
import { EqpTypes } from '@/models'
import { TagMgtForm } from './TagMgtForm'
import { Authorities } from '@/navs/Authorities'

// 【字段】:
const form = new TagMgtForm(EqpTypes.Tag)
const { IsOnlySelected } = form.table

// 【过程】:
onMounted(() => {
    form.Refresh()
})
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>