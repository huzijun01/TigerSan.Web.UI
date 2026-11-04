<template>
    <PageCard>
        <div class="indoor-position-panle">
            <div class="button-panel">
                <button class="bg-success" @click="model.Refresh">{{ Texts.Refresh.value }}</button>
                <button class="bg-success" :disabled="!model.IsEditing.value" @click="model.Save">
                    {{ Texts.Save.value }}</button>
                <button class="bg-danger" :disabled="!model.IsEditing.value" @click="model.Cancel">
                    {{ Texts.Cancel.value }}</button>
                <button :disabled="model.IsEditing.value" @click="model.AddTag1">{{ AddTag }}</button>
                <button :disabled="model.IsEditing.value" @click="model.AddStation1">{{ AddStation }}</button>
                <button :disabled="model.IsEditing.value" @click="model.EditLine">{{ EditingLine }}</button>
                <button :disabled="model.IsEditing.value" @click="model.EditRect">{{ EditingRect }}</button>
                <button :disabled="model.IsEditing.value" @click="model.EditCircle">{{ EditCircle }}</button>
                <button class="bg-danger" :disabled="!model.AllowedDelete.value" @click="model.DeletePoint">
                    {{ DeletePoint }}</button>
            </div>
            <div class="bottom-panel">
                <Svg :model="model._svg" />
            </div>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { PageCard, TextModel, Texts, Svg } from '../../../packages'
import { SvgPageModel } from './SvgPageModel'
const AddTag = TextModel.Computed('AddTag', '添加标签')
const AddStation = TextModel.Computed('AddStation', '添加基站')
const EditingLine = TextModel.Computed('EditingLine', '修改线')
const EditingRect = TextModel.Computed('EditingRect', '修改矩形')
const EditCircle = TextModel.Computed('EditCircle', '修改圆')
const DeletePoint = TextModel.Computed('DeletePoint', '删除点')

const { model } = defineProps({
    model: {
        type: SvgPageModel,
        default: () => new SvgPageModel()
    }
})

onMounted(async () => {
    await model.Refresh()
})
</script>

<style lang="less" scoped>
.indoor-position-panle {
    display: grid;
    grid-template-rows: auto 1fr;
    flex-grow: 1;

    .button-panel {
        overflow: auto;
        margin-bottom: 15px;
        text-wrap: nowrap;

        &>* {
            margin-right: 10px;
        }
    }

    .bottom-panel {
        display: grid;
        height: calc(100vh - 200px);
        background: var(--theme-input-background);
    }
}
</style>