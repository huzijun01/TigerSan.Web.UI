<template>
    <PageCard>
        <div class="map-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <div class="row-panel">
                        <Select :model="filter.selectCompany"></Select>
                        <Select :model="filter.selectDepartment"></Select>
                        <Select :model="filter.selectAssetState"></Select>
                    </div>
                    <div class="row-panel">
                        <Search :model="filter.searchAssetId" />
                        <Select :model="filter.selectAssetType"></Select>
                        <Select :model="filter.selectOnlineState"></Select>
                        <Select :model="filter.selectErrorType"></Select>
                    </div>
                </div>
                <div class="button-panel">
                    <button class="bg-success" @click="Refresh">{{ Texts.Refresh.value }}</button>
                </div>
            </div>
            <div class="bottom-panel">
                <div class="table-panel flex-column">
                    <div class="count-panel">
                        <KeyValue :propName="Texts.Count.value" :propValue="Count" />
                    </div>
                    <div class="list-panel">
                        <AssetInfo v-for="a in AssetInfoes" :key="a._id" :model="a" />
                    </div>
                    <div class="pagination-panel">
                        <Pagination :model="pagination" />
                    </div>
                </div>
                <div class="map-panel">
                    <Map :model="map"></Map>
                </div>
            </div>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import AssetInfo from '@/components/AssetInfo.vue'
import { onMounted } from 'vue'
import { PageCard, Select, Search, Texts, Map, Pagination, KeyValue } from '@/0_tigersan_ui/tigerui'
import { map, Refresh, pagination, Count, AssetInfoes, filter } from './AssetMapPageModel'
// 【字段】:

// 【过程】:
onMounted(async () => {
    await Refresh()
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