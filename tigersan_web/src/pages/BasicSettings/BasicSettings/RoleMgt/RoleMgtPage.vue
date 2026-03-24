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
            <Table :model="roleMgtTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="pagination" :selectedRowCount="roleMgtTable.SelectedRowCount.value" />
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.roleMgtForm">
        <FormRow>
            <FormItem :model="form.configCompany.ItemModel">
                <Select :model="selectCompany"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configDepartment.ItemModel">
                <Select :model="selectDepartment"></Select>
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configName.ItemModel">
                <input type="text" v-model="form.configName.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configAuthority.ItemModel">
                <div class="readonly-panel flex-left" v-show="authorityHelper._tree.IsActive.value">
                    <span class="text">{{ Texts.IsReadonly.value }}</span>
                    <input type="checkbox" v-model="authorityHelper.IsReadonly.value"
                        @change="authorityHelper.SetIsReadonlyRange">
                </div>
                <div class="tree-box">
                    <Tree :model="authorityHelper._tree" />
                </div>
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import form from './RoleMgtForm'
import { onMounted } from 'vue'
import { authorityHelper } from '@/helpers'
import { selectCompany, searchName, roleMgtTable, pagination, selectDepartment } from './RoleMgtTable'
import { Select, Table, Search, PageCard, Pagination, PopForm, FormRow, FormItem, Tree, Texts } from '@/0_tigersan_ui/tigerui'

// 【字段】:
// 表格:
const { IsOnlySelected } = roleMgtTable

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