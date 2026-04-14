<template>
    <ElConfigProvider :locale="model._locale">
        <el-date-picker v-model="model.date.value" @change="model.OnChange" :type="model._type" :format="model._format"
            :value-format="model._valueFormat" :placeholder="model._placeholder"
            :start-placeholder="model._startPlaceholder" :end-placeholder="model._endPlaceholder" />
    </ElConfigProvider>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus'
import { DatePickerModel } from '../../models'

const { model } = defineProps({
    model: {
        type: DatePickerModel,
        default: () => new DatePickerModel()
    }
})
</script>