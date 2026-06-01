<template>
    <div class="map-page">
        <!-- 顶部: -->
        <div class="top-panel flex-between">
            <div class="filter-panel">
                <DatePicker :model="model.date"></DatePicker>
            </div>
            <div class="button-panel">
                <div class="row-panel">
                    <button class="bg-success" @click="model.Refresh">
                        {{ Texts.Refresh.value }}
                    </button>
                </div>
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
                <Map :model="model.map"></Map>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import AssetInfo from '@/components/AssetInfo.vue'
import { onMounted } from 'vue'
import { AssetPathPageModel } from './AssetPathPageModel'
import { Map, Texts, KeyValue, Pagination, DatePicker } from '@/0_tigersan_ui/tigerui'

// 【字段】:
const { model } = defineProps({
    model: {
        type: AssetPathPageModel,
        default: () => new AssetPathPageModel()
    }
})

// 【过程】:
onMounted(() => {
    model.Refresh()
})

// 【方法】:
</script>

<style lang="less" scoped>
@import '@/assets/page.less';

.map-page {
    display: grid;
    grid-template-rows: auto 1fr;
    margin-top: 16px;
    min-height: 70vh;
    max-height: 80vh;

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