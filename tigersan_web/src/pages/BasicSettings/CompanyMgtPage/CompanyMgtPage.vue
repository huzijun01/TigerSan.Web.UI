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
                        <button class="bg-warning" :disabled="!tree.IsActive.value" @click="form.Edit">修改</button>
                        <button class="bg-danger" :disabled="!tree.IsActive.value" @click="form.Delete">删除</button>
                    </div>
                </div>
            </div>

            <!-- 内容: -->
            <div class="content-panel">
                <div class="left-panel">
                    <Tree :model="form.tree"></Tree>
                </div>
                <div class="right-panel">
                    <CompanyInfo :model="tree.ActiveData.value"></CompanyInfo>
                </div>
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
import form from './CompanyMgtForm'
import CompanyInfo from './CompanyInfo.vue'
import { onMounted } from 'vue'
import { tree } from './CompanyMgtTable'
import { Search, PageCard, PopForm, FormRow, FormItem, Tree, Select } from '@/0_tigersan_ui/tigerui'

// 【字段】:

// 【过程】:
// 表格:
onMounted(() => {
    form.Refresh()
})

</script>

<style lang="less" scoped>
@import '@/assets/page.less';


.content-panel {
    height: calc(100% - 40px);
    display: grid;
    grid-template-columns: auto 1fr;

    .left-panel {
        width: 250px;
        margin-right: 15px;
        overflow: auto;
    }

    .right-panel {
        overflow: auto;
        background: var(--theme-input-background);
    }
}
</style>