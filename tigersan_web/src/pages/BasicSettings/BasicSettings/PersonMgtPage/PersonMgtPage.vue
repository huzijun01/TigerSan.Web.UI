<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Search :model="searchName"></Search>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button @click="form.Add">+ 新增</button>
                        <button class="bg-warning" :disabled="!IsOnlySelected" @click="form.Edit">修改</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="form.Delete">删除</button>
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
    <PopForm :model="form.baseStationForm">
        <FormRow>
            <FormItem :model="form.configRole.ItemModel">
                <Select :model="selectRole"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configUsername.ItemModel">
                <input type="text" v-model="form.configUsername.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configNickname.ItemModel">
                <input type="text" v-model="form.configRole.Target.value">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import form from './PersonMgtForm'
import { selectRole, searchName, personMgtTable, pagination } from './PersonMgtTable'
import { Select, Table, Search, PageCard, Pagination, PopForm, FormRow, FormItem } from '@/0_tigersan_ui/tigerui'

// 【字段】:
// 表格:
const { IsOnlySelected } = personMgtTable

// 【方法】:
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>