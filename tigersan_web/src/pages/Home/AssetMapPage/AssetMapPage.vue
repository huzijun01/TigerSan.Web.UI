<template>
    <PageCard>
        <div class="map-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="model.filter.selectDepartment" />
                        <Select :model="model.filter.selectAssetState" />
                        <Select :model="model.filter.selectOnlineState" />
                        <Select :model="model.filter.selectErrorType" />
                    </div>
                    <div class="row-panel">
                        <Search :model="model.filter.searchAssetId" />
                        <Select :model="model.filter.selectAssetType" />
                        <Select :model="model.filter.selectIsFall" />
                    </div>
                </div>
                <div class="button-panel">
                    <button class="bg-success" @click="model.Refresh">{{ Texts.Refresh.value }}</button>
                </div>
            </div>
            <div class="bottom-panel">
                <div class="table-panel flex-column">
                    <div class="count-panel">
                        <KeyValue :propName="Texts.Count.value" :propValue="model.Count" />
                    </div>
                    <div class="list-panel">
                        <AssetInfo v-for="a in model.AssetInfoes" :key="a._id" :model="a" />
                    </div>
                    <div class="pagination-panel">
                        <Pagination :model="model.pagination" />
                    </div>
                </div>
                <div class="map-panel">
                    <Map :model="model.map" />
                </div>
            </div>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import AssetInfo from '@/components/AssetInfo.vue'
import { onMounted, onUnmounted } from 'vue'
import { PageCard, Select, Search, Texts, Map, Pagination, KeyValue } from '@/0_tigersan_ui/tigerui'
import { AssetMapPageModel } from './AssetMapPageModel'
// 【字段】:
const model = new AssetMapPageModel()

// 【过程】:
onMounted(async () => {
    await model.Refresh()
    model.filter.StartWatch()
})

onUnmounted(() => {
    model.filter.StopWatch()
})

// 【方法】:
</script>

<style lang="less" scoped>
@import '@/assets/page.less';

.map-page {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;

    .bottom-panel {
        display: grid;
        grid-template-columns: auto 1fr;
        margin-top: 16px;

        .table-panel {
            min-width: 250px;
            margin-right: 16px;

            .count-panel {
                padding: 5px 10px;
            }

            .list-panel {
                flex-grow: 1;
                overflow: auto;
                max-height: calc(100vh - 300px);
            }

            .pagination-panel {
                overflow: auto;
            }
        }
    }
}
</style>