<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel flex-left">
                        <Select :model="form.selectGender" />
                    </div>
                </div>
                <div class="button-panel">
                    <div class="row-panel flex-right">
                        <button class="bg-success" @click="form.Refresh">{{ Texts.Refresh.value }}</button>
                        <button @click="form.Add">
                            {{ Texts.Add.value }}</button>
                        <button class="bg-warning" :disabled="!IsOnlySelected" @click="form.Edit">
                            {{ Texts.Edit.value }}</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="form.Delete">
                            {{ Texts.Delete.value }}</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="personTable"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="form.pagination" :selectedRowCount="personTable.SelectedRowCount.value" />
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="form.personForm">
        <FormRow>
            <FormItem :model="form.configId.ItemModel">
                <input type="text" v-model="form.configId.Target.value" :readonly="form.IsIdReadonly.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configName.ItemModel">
                <input type="text" v-model="form.configName.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configAge.ItemModel">
                <input type="text" v-model="form.configAge.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configGender.ItemModel">
                <Select :model="form.selectGenderForm" />
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configSalary.ItemModel">
                <input type="text" v-model="form.configSalary.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="form.configJoiningTime.ItemModel">
                <DatePicker :model="form.joiningTime" />
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { personTable } from './TableModel'
import { PersonForm } from './TablePageModel'
import { Select, Table, PageCard, Pagination, PopForm, FormRow, FormItem, Texts, DatePicker } from '../../../packages'

// 【字段】:
const form = new PersonForm()
const { IsOnlySelected } = personTable

// 【过程】:
onMounted(() => {
    form.Refresh()
})

// 【方法】:
</script>

<style lang="less" scoped>
@Gap: 10px;

.child-margin-bottom {
    &>div:not(:last-child) {
        margin-bottom: @Gap;
    }

}

.child-margin-right {
    &>:not(:last-child) {
        margin-right: @Gap;
    }
}

.table-page {
    display: flex;
    flex-direction: column;
    height: 100%; // 必须设置父容器高度

    /* 顶部: */
    .top-panel {
        // 显示:
        overflow: auto;
        flex-shrink: 0;
        // 尺寸:
        margin-bottom: @Gap;

        &>* {
            // 显示:
            flex-shrink: 0;
        }

    }

    /* 底部: */
    .bottom-panel {
        // 显示:
        flex-shrink: 0;
        overflow: auto;
    }
}

.filter-panel {
    // 尺寸:
    .child-margin-bottom();

    .row-panel {
        // 显示:
        .child-margin-right();
    }
}

.button-panel {
    // 尺寸:
    padding-left: 20px;
    .child-margin-bottom();

    .row-panel {
        // 显示:
        .child-margin-right();
    }
}
</style>