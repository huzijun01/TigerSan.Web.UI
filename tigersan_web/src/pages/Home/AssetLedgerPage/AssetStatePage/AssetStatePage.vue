<template>
    <div class="state-page">
        <!-- 顶部: -->
        <div class="top-panel flex-between">
            <div class="map-panel">
                <Map :model="model.map" />
            </div>
        </div>
        <div class="right-panel">
            <!-- 基础详情： -->
            <div class="title">{{ Texts.BasicDetail.value }}</div>
            <KeyValue :isAutoHidden="true" :propName="Texts.Company.value"
                :propValue="model.Asset.value?.companyName" />
            <KeyValue :isAutoHidden="true" :propName="Texts.Department.value"
                :propValue="model.Asset.value?.departmentName" />
            <KeyValue :isAutoHidden="true" :propName="Texts.Tag.value" :propValue="model.Asset.value?.tagId" />
            <KeyValue :isAutoHidden="true" :propName="Texts.AllotMode.value"
                :propValue="IsAuto.ToString(model.Asset.value?.isAuto)" />
            <KeyValue :isAutoHidden="true" :propName="Texts.IsFall.value"
                :propValue="IsFall.ToString(model.Asset.value?.isFall ?? false)" />
            <KeyValue :isAutoHidden="true" :propName="Texts.AssetType.value" :propValue="model.Asset.value?.typeName" />
            <KeyValue :isAutoHidden="true" :propName="Texts.ErrorType.value"
                :propValue="ErrorType.GetName(model.Asset.value?.errorType)" />
            <KeyValue :isAutoHidden="true" :propName="Texts.Vehicle.value" :propValue="model.Asset.value?.plate" />
            <!-- 标签详情： -->
            <div class="title">{{ Texts.TagDetail.value }}</div>
            <KeyValue :isAutoHidden="true" :propName="Texts.TagType.value"
                :propValue="tagTypeHelper.GetName(model.Asset.value?.tagType)" />
            <KeyValue :isAutoHidden="true" :propName="Texts.OnlineState.value"
                :propValue="OnlineState.ToString(model.Tag.value?.onlineState)" />
            <KeyValue :isAutoHidden="true" :propName="Texts.Battery.value" :propValue="model.Tag.value?.battery" />
            <KeyValue :isAutoHidden="true" :propName="Texts.Site.value" :propValue="model.Asset.value?.siteName" />
            <KeyValue :isAutoHidden="true" :propName="Texts.ReportTime.value"
                :propValue="ObjectHelper.GetDateString(model.Tag.value?.reportTime)" />
        </div>
        <div class="bottom-panel flex-left">
            <div class="addr-panel flex-left">
                <div class="location-mode" v-if="model.IsShowLocationMode.value">{{ model.LocationMode.value }}</div>
                <div class="addr">{{ model.Asset.value?.fullAddr }}</div>
            </div>
            <button class="bg-success" @click="model.Refresh">{{ Texts.Refresh.value }}</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { AssetStatePageModel } from './AssetStatePageModel'
import { Map, Texts, KeyValue, IsFall, ObjectHelper, OnlineState, IsAuto, StringHelper } from '@/0_tigersan_ui/tigerui'
import { ErrorType, LocationMode, tagTypeHelper } from '@/models';

// 【字段】:
const { model } = defineProps({
    model: {
        type: AssetStatePageModel,
        default: () => new AssetStatePageModel()
    }
})

// 【过程】:
onMounted(() => {
    model.Refresh()
})

// 【方法】:
</script>

<style lang="less" scoped>
.state-page {
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: 1fr auto;
    margin-top: 16px;
    min-height: 70vh;
    max-height: 80vh;

    .right-panel {
        grid-column: 2/3;
        padding: 0 15px;

        &>* {
            margin-bottom: 10px;
        }

        .title {
            margin: 15px 0;
            font-size: 18px;
            font-weight: bold;
        }
    }

    .bottom-panel {
        grid-row: 2/3;
        padding-top: 15px;

        .addr-panel {
            flex-grow: 1;

            .location-mode {
                padding: 3px 5px;
                margin-right: 10px;
                border-radius: 3px;
                color: var(--color-brand);
                background: var(--color-brand-10);
            }

            .addr {
                user-select: text;
            }
        }
    }
}
</style>