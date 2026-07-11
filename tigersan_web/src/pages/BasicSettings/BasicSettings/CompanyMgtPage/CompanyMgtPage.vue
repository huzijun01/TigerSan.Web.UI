<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="form.selectCompany" />
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">{{ Texts.Refresh.value }}</button>
                        <button v-if="!Authorities.CompanyMgtPage.IsReadonly.value" @click="form.Add">
                            {{ Texts.Add.value }}</button>
                        <button v-if="!Authorities.CompanyMgtPage.IsReadonly.value" class="bg-warning"
                            :disabled="!form.Tree.IsActive.value" @click="form.Edit">{{ Texts.Edit.value }}</button>
                        <button v-if="!Authorities.CompanyMgtPage.IsReadonly.value" class="bg-danger"
                            :disabled="!form.Tree.IsActive.value" @click="form.Delete">{{ Texts.Delete.value }}</button>
                    </div>
                </div>
            </div>

            <!-- 内容: -->
            <div class="content-panel">
                <div class="left-panel">
                    <Tree :model="form.Tree" />
                </div>
                <div class="right-panel">
                    <CompanyInfo v-if="form.Tree.IsActive.value" :model="form.companyInfo" />
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
            <FormItem :model="form.configParent.ItemModel">
                <Select :model="form.selectParentCompany" />
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import CompanyInfo from './CompanyInfo.vue'
import { onMounted } from 'vue'
import { Authorities } from '@/navs/Authorities'
import { CompanyMgtForm } from './CompanyMgtForm'
import { PageCard, PopForm, FormRow, FormItem, Tree, Select, Texts } from '@/0_tigersan_ui/tigerui'

// 【字段】:
const form = new CompanyMgtForm()

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
        width: 300px;
        margin-right: 15px;
        overflow: auto;
    }

    .right-panel {
        overflow: auto;
        background: var(--theme-input-background);
    }
}
</style>