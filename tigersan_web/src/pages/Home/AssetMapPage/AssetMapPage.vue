<template>
    <PageCard>
        <div class="map-page">
            <!-- 顶部: -->
            <div class="top-panel flex-between">
                <div class="filter-panel">
                </div>
                <div class="button-panel">
                </div>
            </div>
            <div class="map-panel">
                <Map :model="map"></Map>
            </div>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import Map from '@/components/Map.vue'
import { onMounted } from 'vue'
import { PageCard } from '@/0_tigersan_ui/tigerui'
import { map } from './AssetMapPageModel'
// 【字段】:

// 【过程】:
onMounted(() => {

})

// 【方法】:
</script>

<style lang="less" scoped>
.map-page {
    display: grid;
    grid-template-rows: auto 1fr;
    width: 100%;
    height: 100%;

    .top-panel {
        padding: 16px;
    }
}
</style>