<template>
    <div class="company-info">
        <div class="info-panel">
            <KeyValue :propName="Texts.Name.value" :propValue="model.Name.value" />
            <KeyValue v-if="model.IsShowAddr.value" :propName="Texts.Addr.value" :propValue="model.Addr.value" />
        </div>
        <div class="dashboard-panel flex-stretch">
            <CountCard class="bg-info" :icon="Icons.Building_1" :title="Texts.Site.value"
                :count="model.SiteCount.value" />
            <CountCard class="bg-warning" :icon="Icons.Router" :title="Texts.BaseStation.value"
                :count="model.BaseStationCount.value" />
            <CountCard class="bg-brand" :icon="Icons.Label_2" :title="Texts.Tag.value" :count="model.TagCount.value" />
            <CountCard class="bg-success" :icon="Icons.Asset" :title="Texts.Asset.value"
                :count="model.AssetCount.value" />
        </div>
        <div class="chart-panel flex-stretch">
            <EChart :model="model.assetStates" />
            <!-- <EChart :model="model.pie1" />
            <EChart :model="model.pie2" />
            <EChart :model="model.pie3" /> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, type PropType } from 'vue'
import { Texts, KeyValue, Icons, CountCard, EChart } from '@/0_tigersan_ui/tigerui'
import { CompanyInfoModel } from '@/models'

//字段:
const { model } = defineProps({
    model: {
        type: Object as PropType<CompanyInfoModel>,
        default: () => new CompanyInfoModel()
    },
})

onMounted(async () => {
    await model.Refresh()
})
</script>

<style lang="less" scoped>
.company-info {
    padding: 10px;
    line-height: 1.5;

    &>* {
        margin-bottom: 15px;
    }

    .dashboard-panel {
        gap: 15px;
    }

    .chart-panel {
        flex-wrap: wrap;
    }
}
</style>