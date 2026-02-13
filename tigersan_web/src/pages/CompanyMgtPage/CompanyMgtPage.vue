<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <input type="text" placeholder="请输入公司名称">
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button @click="form.Add">+ 新增</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <div class="company-panel">
                <Company v-for="c in companyMgtTable.RowDatas" :key="(c as CompanyMgtModel).id"
                    :model="(c as CompanyMgtModel)"></Company>
            </div>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="paginationModel" :selectedRowCount="companyMgtTable.SelectedRowCount.value">
                </Pagination>
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.gatewayForm">
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
    </PopForm>
</template>

<script lang="ts" setup>
import {
    PopForm,
    FormRow,
    FormItem,
    PageCard,
    Pagination,
    PaginationModel,
} from '@/tigerui'
import { CompanyMgtModel, companyMgtTable } from './CompanyMgtTable'
import form from './CompanyMgtForm'
import Company from '@/components/Company.vue'

// 【字段】:

// 【过程】:
// 表格:
companyMgtTable.IsAllowMultiSelect.value = false

// 分页器:
let paginationModel = new PaginationModel()
paginationModel.IsShowSelectedRowCount.value = true
paginationModel.Count.value = companyMgtTable.Count.value
</script>

<style lang="less" scoped>
@import '../../assets/page.less';

.company-panel {
    flex-grow: 1;
}
</style>