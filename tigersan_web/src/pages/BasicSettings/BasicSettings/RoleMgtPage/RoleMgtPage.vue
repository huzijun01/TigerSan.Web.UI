<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="form.selectCompany"></Select>
                        <Select :model="form.selectDepartment"></Select>
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="form.Refresh">刷新</button>
                        <button v-if="!Authorities.RoleMgtPage.IsReadonly.value" @click="form.Add">新增</button>
                        <button v-if="!Authorities.RoleMgtPage.IsReadonly.value" class="bg-warning"
                            :disabled="!IsAllowEdit" @click="form.Edit">修改</button>
                        <button v-if="!Authorities.RoleMgtPage.IsReadonly.value" class="bg-danger"
                            :disabled="!IsAllowEdit" @click="form.Delete">删除</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="roleMgtTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="form.pagination" :selectedRowCount="roleMgtTable.SelectedRowCount.value" />
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.roleForm">
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
            <FormItem :model="form.configName.ItemModel">
                <input type="text" v-model="form.configName.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configAuthorities.ItemModel">
                <div class="readonly-panel flex-left" v-show="form.authorityHelperForm._tree.IsActive.value">
                    <span class="text">{{ Texts.IsReadonly.value }}</span>
                    <input type="checkbox" v-model="form.authorityHelperForm.IsReadonly.value"
                        @change="form.authorityHelperForm.UpdateIsReadonlyRange">
                </div>
                <div class="tree-box">
                    <Tree :model="form.authorityHelperForm._tree" />
                </div>
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useUserInfo } from '@/stores'
import { roleMgtTable } from './RoleMgtTable'
import { Authorities } from '@/navs/Authorities'
import { roleMgtForm as form } from './RoleMgtForm'
import { Select, Table, PageCard, Pagination, PopForm, FormRow, FormItem, Tree, Texts, BigintHelper } from '@/0_tigersan_ui/tigerui'

// 【字段】:
// 表格:
const { IsOnlySelected } = roleMgtTable
const userInfo = useUserInfo()
const IsAllowEdit = computed(() => IsOnlySelected.value
    && !BigintHelper.IsEqualAndNotUndefined(roleMgtTable.SelectedRowDatas.value[0]?.id, userInfo.role))

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