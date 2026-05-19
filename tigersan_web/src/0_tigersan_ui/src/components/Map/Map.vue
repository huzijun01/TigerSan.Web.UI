<template>
    <div class="map-container" ref="refContainer"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, type PropType } from "vue"
import { MapModel } from "../../models/Map/MapModel"

//字段:
const { model } = defineProps({
    model: {
        type: Object as PropType<MapModel>,
        default: () => new MapModel()
    },
})

const { refContainer } = model

onMounted(async () => {
    await model.InitAsync()
})

onUnmounted(() => {
    model._map?.destroy()
})
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 100%;
}
</style>
