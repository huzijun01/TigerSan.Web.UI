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
                <Tree :model="form.tree"></Tree>
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
        <FormRow>
            <FormItem :model="form.configParentCompany.ItemModel">
                <Select :model="form.selectParentCompany"></Select>
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import {
    Search, PageCard, PopForm, FormRow, FormItem, Tree, Select
} from '@/0_tigersan_ui/tigerui'
import { CompanyMgtModel, companyMgtTable } from './CompanyMgtTable'
import form from './CompanyMgtForm'
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