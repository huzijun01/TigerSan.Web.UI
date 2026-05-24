<template>
    <PageCard>
        <div class="table-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                </div>
                <div class="button-panel">
                    <div class="row-panel">
                        <button class="bg-success" @click="model.Refresh">{{ Texts.Refresh.value }}</button>
                        <button @click="model.Add">{{ Texts.Add.value }}</button>
                        <button class="bg-warning" :disabled="!IsOnlySelected" @click="model.Edit">{{ Texts.Edit.value
                            }}</button>
                        <button class="bg-danger" :disabled="!IsOnlySelected" @click="model.Delete">{{
                            Texts.Delete.value }}</button>
                    </div>
                </div>
            </div>

            <!-- 表格: -->
            <Table :model="model.table"></Table>

            <!-- 底部: -->
            <div class="bottom-panel flex-center ">
                <Pagination :model="model.pagination" :selectedRowCount="model.table.SelectedRowCount.value" />
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="model.form">
        <FormRow>
            <FormItem :model="model.configName.ItemModel">
                <input type="text" v-model="model.configName.Target.value">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import Table from './Table/Table.vue'
import PageCard from './PageView/PageCard.vue'
import Pagination from './Pagination/Pagination.vue'
import PopForm from './Form/PopForm.vue'
import FormRow from './Form/FormRow.vue'
import FormItem from './Form/FormItem.vue'
import { Texts } from '@/0_tigersan_ui/tigerui'
import { DictionaryModel } from '../models/DictionaryModel'
import { DictionaryHelper } from '../helpers/DictionaryHelper'

const { model } = defineProps({
    model: {
        type: DictionaryModel,
        default: () => new DictionaryModel('', new DictionaryHelper('', '', ''))
    }
})

// 【字段】:
// 表格:
const { IsOnlySelected } = model.table

// 【过程】:
onMounted(() => {
    model.Refresh()
})

// 【方法】:
</script>

<style lang="less" scoped>
@import '@/assets/page.less';
</style>