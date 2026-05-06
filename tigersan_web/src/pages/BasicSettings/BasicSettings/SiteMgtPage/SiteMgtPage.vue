<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="form.selectCompany"></Select>
                        <Select :model="form.selectType"></Select>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button v-if="!Authorities.SiteMgt.IsReadonly.value" @click="form.Add">新增</button>
                        <button v-if="!Authorities.SiteMgt.IsReadonly.value" class="bg-warning" :disabled="!IsOnlySelected" @click="form.Edit">修改</button>
                        <button v-if="!Authorities.SiteMgt.IsReadonly.value" class="bg-danger" :disabled="!IsOnlySelected" @click="form.Delete">删除</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="siteMgtTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="form.pagination" :selectedRowCount="siteMgtTable.SelectedRowCount.value" />
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.siteForm">
        <FormRow>
            <FormItem :model="form.configCompany.ItemModel">
                <Select :model="form.selectCompanyForm"></Select>
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
            <FormItem :model="form.configAddr.ItemModel">
                <input type="text" v-model="form.configAddr.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configAddrDetail.ItemModel">
                <input type="text" v-model="form.configAddrDetail.Target.value">
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
import { onMounted } from 'vue'
import { siteMgtTable } from './SiteMgtTable'
import { Authorities } from '@/navs/Authorities'
import { siteMgtForm as form } from './SiteMgtForm'
import { Select, Table, PageCard, Pagination, PopForm, FormRow, FormItem } from '@/0_tigersan_ui/tigerui'

// 【字段】:
// 表格:
const { IsOnlySelected } = siteMgtTable

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