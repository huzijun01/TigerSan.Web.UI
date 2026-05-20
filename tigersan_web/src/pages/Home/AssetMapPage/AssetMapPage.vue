<template>
    <PageCard>
        <div class="map-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                    <Select :model="selectAddr"></Select>
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
import { PageCard, Select, Texts, Map, Pagination, KeyValue } from '@/0_tigersan_ui/tigerui'
import { map, selectAddr, Refresh, pagination, Count, AssetInfoes } from './AssetMapPageModel'
// 【字段】:

// 【过程】:
onMounted(async () => {
    await Refresh()
})

// 【方法】:
</script>

<style lang="less" scoped>
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
                max-height: calc(100vh - 255px);
            }

            .pagination-panel {
                overflow: auto;
            }
        }
    }
}
</style>