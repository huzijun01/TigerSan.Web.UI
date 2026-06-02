<template>
    <div class="map-panel">
        <div class="map-container" ref="refContainer"></div>
        <div class="search-panel" v-if="model.IsShowSelect.value">
            <Select :model="model.SelectAddr"></Select>
        </div>
        <div class="button-panel" v-if="model.IsShowButton.value">
            <button class="bg-success" :disabled="!model.IsEditing.value" @click="model.SavePolygon">
                {{ Texts.Save.value }}
            </button>
            <button :disabled="!model.IsAllowCreate.value" @click="model.NewPolygon">
                {{ Texts.Add.value }}
            </button>
            <button :disabled="!model.IsEditing.value" class="bg-danger" @click="model.RemoveTagetPolygon">
                {{ Texts.Delete.value }}
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Select from "../Inputs/Select.vue"
import { onMounted, onUnmounted, type PropType } from "vue"
import { Texts } from "../../texts"
import { MapModel } from "../../models/Map/MapModel"

//字段:
const { model } = defineProps({
    model: {
        type: Object as PropType<MapModel<any>>,
        default: () => new MapModel()
    },
})

const { refContainer } = model

onMounted(async () => {
    if (model._isAutoInit) await model.InitAsync()
})

onUnmounted(() => {
    model._map?.destroy()
})
</script>

<style scoped lang="less">
.map-panel {
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 600px;
    min-height: 600px;

    &>* {
        position: absolute;
        padding: 10px;
    }

    .map-container {
        width: 100%;
        height: 100%;
    }

    .button-panel {
        right: 0;

        button {
            margin-left: 10px;
        }
    }
}
</style>
