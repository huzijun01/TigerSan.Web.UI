<template>
    <div class="state-panel">
        <!-- 基础详情： -->
        <div class="title">{{ Texts.BasicDetail.value }}</div>
        <KeyValue :isAutoHidden="true" :propName="Texts.Name.value" :propValue="asset?.name" />
        <KeyValue :isAutoHidden="true" :propName="Texts.Company.value" :propValue="asset?.companyName" />
        <KeyValue :isAutoHidden="true" :propName="Texts.Department.value" :propValue="asset?.departmentName" />
        <KeyValue :isAutoHidden="true" :propName="Texts.Tag.value" :propValue="asset?.tagId" />
        <KeyValue :isAutoHidden="true" :propName="Texts.AllotMode.value" :propValue="IsAuto.ToString(asset?.isAuto)" />
        <KeyValue :isAutoHidden="true" :propName="Texts.IsFall.value"
            :propValue="IsFall.ToString(asset?.isFall ?? false)" />
        <KeyValue :isAutoHidden="true" :propName="Texts.AssetType.value" :propValue="asset?.typeName" />
        <KeyValue :isAutoHidden="true" :propName="Texts.ErrorType.value"
            :propValue="ErrorType.GetName(asset?.errorType)" />
        <KeyValue :isAutoHidden="true" :propName="Texts.Vehicle.value" :propValue="asset?.plate" />
        <!-- 标签详情： -->
        <div class="title">{{ Texts.TagDetail.value }}</div>
        <KeyValue :isAutoHidden="true" :propName="Texts.TagType.value"
            :propValue="tagTypeHelper.GetName(asset?.tagType)" />
        <KeyValue :isAutoHidden="true" :propName="Texts.OnlineState.value"
            :propValue="OnlineState.ToString(tag?.onlineState)" />
        <KeyValue :isAutoHidden="true" :propName="Texts.Battery.value" :propValue="tag?.battery" />
        <KeyValue :isAutoHidden="true" :propName="Texts.Site.value" :propValue="asset?.siteName" />
        <KeyValue :isAutoHidden="true" :propName="Texts.ReportTime.value"
            :propValue="ObjectHelper.GetDateString(tag?.reportTime)" />
    </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import { Texts, KeyValue, IsFall, ObjectHelper, OnlineState, IsAuto } from '@/0_tigersan_ui/tigerui'
import { AssetDto, ErrorType, TagDto, tagTypeHelper } from '@/models'

// 【字段】:
const { asset, tag } = defineProps({
    asset: {
        type: Object as PropType<AssetDto | undefined>,
        default: undefined
    },
    tag: {
        type: Object as PropType<TagDto | undefined>,
        default: undefined
    }
})

// 【方法】:
</script>

<style lang="less" scoped>
.state-panel {
    &>* {
        margin-bottom: 10px;
    }

    .title {
        margin: 15px 0;
        font-size: 18px;
        font-weight: bold;
    }
}
</style>