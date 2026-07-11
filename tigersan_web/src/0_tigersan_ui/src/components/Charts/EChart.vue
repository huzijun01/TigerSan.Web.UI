<template>
    <div class="echart-panel" ref="refRoot" :style="model.RootStyle.value"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { ChartModel } from '../../models'

const { model } = defineProps({
    model: {
        type: ChartModel,
        default: () => new ChartModel()
    }
})

const { refRoot } = model

onMounted(() => {
    model.InitBase()
    model.watchLocale.Start()
    model.watchIsDark.Start()
})

onUnmounted(() => {
    model.watchLocale.Stop()
    model.watchIsDark.Stop()
})
</script>

<style lang="less" scoped></style>