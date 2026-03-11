<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Search :model="form.searchCompany"></Search>
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
                <Company v-for="c in companyMgtTable.RowDatas" :key="(c as CompanyMgtModel).index"
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
    <PopForm :model="form.companyForm">
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
    Search, PageCard, Pagination, PopForm, FormRow, FormItem
} from '@/0_tigersan_ui/tigerui'
import { CompanyMgtModel, companyMgtTable, paginationModel } from './CompanyMgtTable'
import form from './CompanyMgtForm'
import Company from '@/components/Company.vue'
import { onMounted } from 'vue'

// 【字段】:

// 【过程】:
// 表格:
onMounted(() => {
    form.Refresh()
})

</script>

<style lang="less" scoped>
@import '@/assets/page.less';

.company-panel {
    flex-grow: 1;
}
</style>