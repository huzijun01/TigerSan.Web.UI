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
            <div class="map-panel">
                <Map :model="map"></Map>
            </div>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { PageCard, Select, Texts, Map } from '@/0_tigersan_ui/tigerui'
import { map, selectAddr, Refresh } from './AssetMapPageModel'

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
    width: 100%;
    height: 100%;

    .top-panel {
        margin: 0 0 16px 0;
    }
}
</style>