<template>
    <PageCard>
        <div class="indoor-position-panle">
            <div class="button-panel">
                <button class="bg-success" @click="model.Refresh">{{ Texts.Refresh.value }}</button>
                <button class="bg-success" :disabled="!model.IsEditing.value" @click="model.Save">
                    {{ Texts.Save.value }}</button>
                <button class="bg-danger" :disabled="!model.IsEditing.value" @click="model.Cancel">
                    {{ Texts.Cancel.value }}</button>
                <button :disabled="model.IsEditing.value" @click="model.AddStation1">{{ AddStation }}</button>
                <button :disabled="model.IsEditing.value" @click="model.EditLine">{{ EditingLine }}</button>
                <button :disabled="model.IsEditing.value" @click="model.EditRect">{{ EditingRect }}</button>
                <button :disabled="model.IsEditing.value" @click="model.EditCircle">{{ EditCircle }}</button>
            </div>
            <div class="bottom-panel">
                <TabView :model="tabList" />
                <div class="map-panel">
                    <img class="bg" :src="model.BgUrl.value" ref="refRoot">
                    <svg :style="model._size.SizeStyle.value" @mousedown="model.OnMouseDown" @mouseup="model.OnMouseUp"
                        @mousemove="model.OnMouseMove">
                        <Point v-for="p in model.Tags" :key="p._id" :model="p" />
                        <Point v-for="p in model.Stations" :key="p._id" :model="p" @click="model.OnPointClick(p)" />
                        <Rect v-for="r in model.Rects" :key="r._id" :model="r" />
                        <Circle v-for="c in model.Circles" :key="c._id" :model="c" />
                        <Point v-if="model.EditingPoint.value" :model="model.EditingPoint.value" />
                        <Line v-if="model.EditingLine.value" :model="model.EditingLine.value" />
                        <Rect v-if="model.EditingRect.value" :model="model.EditingRect.value" />
                        <Circle v-if="model.EditingCircle.value" :model="model.EditingCircle.value" />
                    </svg>
                </div>
            </div>
        </div>
    </PageCard>

    <!-- 表单: -->
    <PopForm :model="model.stationForm">
        <FormRow>
            <FormItem :model="model.configMacAddr.ItemModel">
                <input type="text" v-model="model.configMacAddr.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="model.configX.ItemModel">
                <input type="text" disabled v-model="model.configX.Target.value">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="model.configY.ItemModel">
                <input type="text" disabled v-model="model.configY.Target.value">
            </FormItem>
        </FormRow>
    </PopForm>
</template>

<script lang="ts" setup>
import Line from '@/models/Shapes/Line.vue'
import Rect from '@/models/Shapes/Rect.vue'
import Point from '@/models/Shapes/Point.vue'
import Circle from '@/models/Shapes/Circle.vue'
import PositionList from '@/pages/Home/AssetMapPage/PositionList/PositionList.vue'
import { onMounted, onUnmounted } from 'vue'
import { PopForm, FormRow, FormItem, PageCard, TabView, TabViewModel, TextModel, Texts } from '@/0_tigersan_ui/tigerui'
import { IndoorPositionPageModel } from './IndoorPositionPageModel'
const model = new IndoorPositionPageModel()
const { refRoot } = model._size
const AddStation = TextModel.Computed('AddStation', '添加基站')
const EditingLine = TextModel.Computed('EditingLine', '修改线')
const EditingRect = TextModel.Computed('EditingRect', '修改矩形')
const EditCircle = TextModel.Computed('EditCircle', '修改圆')

const tabList = new TabViewModel([
    {
        Title: Texts.Tag,
        _component: PositionList,
        _rootProps: { model: model.tagList },
    },
    {
        Title: Texts.BaseStation,
        _component: PositionList,
        _rootProps: { model: model.stationList },
    }
])

onMounted(async () => {
    model._size.Observe()
    await model.Refresh()
})

onUnmounted(() => {
    model._size.Unobserver()
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

        &>* {
            margin-right: 10px;
        }
    }

    .bottom-panel {
        display: grid;
        grid-template-columns: auto 1fr;
        margin-top: 16px;
        height: calc(100vh - 220px);

        .map-panel {
            position: relative;
            overflow: auto;

            svg {
                top: 0;
                left: 0;
                position: absolute;
            }
        }
    }
}
</style>