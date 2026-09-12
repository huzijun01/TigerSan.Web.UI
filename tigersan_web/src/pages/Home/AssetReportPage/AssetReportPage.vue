<template>
    <PageCard>
        <div class="btn-panel flex-left">
            <button class="bg-success" @click="Refresh">{{ Texts.Refresh.value }}</button>
        </div>
        <div class="chart-panel flex-stretch">
            <div class="card">
                <AssetStatePieChart ref="refAssetState" />
            </div>
            <div class="card">
                <AssetOnlineStateChart ref="refAssetOnlineState" />
            </div>
            <div class="card">
                <AssetStateRecordChart ref="refAssetRecord" />
            </div>
            <!-- <div class="card">
                <AssetOnlineStateChart ref="refAssetOnlineState" />
            </div> -->
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import AssetStatePieChart from './AssetStatePieChart.vue'
import AssetOnlineStateChart from './AssetOnlineStateChart.vue'
import AssetStateRecordChart from './AssetStateRecordChart.vue'
import { onMounted, ref } from 'vue'
import { AssetReportPageModel } from './AssetReportPageModel'
import { PageCard, Texts } from '@/0_tigersan_ui/tigerui'

// 【字段】:
const model = new AssetReportPageModel()
const refAssetState = ref<InstanceType<typeof AssetStatePieChart>>()
const refAssetOnlineState = ref<InstanceType<typeof AssetOnlineStateChart>>()
const refAssetRecord = ref<InstanceType<typeof AssetStateRecordChart>>()

// 【过程】:
// 表格:
onMounted(() => {
})

function Refresh() {
    refAssetState.value?.Refresh()
    refAssetOnlineState.value?.Refresh()
    refAssetRecord.value?.Refresh()
}
</script>

<style lang="less" scoped>
.chart-panel {
    gap: 15px;
    flex-wrap: wrap;
    margin-top: 15px;

    .card {
        flex: 1;
        padding: 10px;
        min-width: 350px;
        border-radius: 10px;
        background-color: var(--theme-panel-background);
    }
}
</style>