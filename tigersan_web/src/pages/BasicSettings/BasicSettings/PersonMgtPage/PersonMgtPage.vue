<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="form.selectCompany"></Select>
                        <Select :model="form.selectDepartment"></Select>
                        <Select :model="form.selectRole"></Select>
                        <Search :model="form.searchName"></Search>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button v-if="!Authorities.PersonMgtPage.IsReadonly.value" @click="form.Add">新增</button>
                        <button v-if="!Authorities.PersonMgtPage.IsReadonly.value" class="bg-warning"
                            :disabled="!IsOnlySelected" @click="form.Edit">修改</button>
                        <button v-if="!Authorities.PersonMgtPage.IsReadonly.value" class="bg-danger"
                            :disabled="!IsOnlySelected" @click="form.Delete">删除</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="personMgtTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="pagination" :selectedRowCount="personMgtTable.SelectedRowCount.value" />
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.personForm">
        <FormRow>
            <FormItem :model="form.configCompany.ItemModel">
                <Select :model="form.selectCompanyForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configDepartment.ItemModel">
                <Select :model="form.selectDepartmentForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configRole.ItemModel">
                <Select :model="form.selectRoleForm"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configUsername.ItemModel">
                <input type="text" v-model="form.configUsername.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configTagId.ItemModel">
                <input type="text" v-model="form.configTagId.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configPassword.ItemModel">
                <Password :model="form.password"></Password>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configPhone.ItemModel">
                <input type="text" v-model="form.configPhone.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configMail.ItemModel">
                <input type="text" v-model="form.configMail.Target.value">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { Authorities } from '@/navs/Authorities'
import { personMgtForm as form } from './PersonMgtForm'
import { personMgtTable, pagination } from './PersonMgtTable'
import { Select, Search, Table, PageCard, Pagination, PopForm, FormRow, FormItem, Password } from '@/0_tigersan_ui/tigerui'

// 【字段】:
// 表格:
const { IsOnlySelected } = personMgtTable

// 【过程】:
onMounted(() => {
    form.Refresh()
})

// 【方法】:
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>