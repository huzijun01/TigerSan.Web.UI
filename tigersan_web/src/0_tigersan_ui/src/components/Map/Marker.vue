<template>
    <div class="marker" :style="markerStyle" @mouseover="InitInfo" @click="OnClick">
        <div class="info" ref="refInfo" :style="infoStyle"></div>
        <div class="flag iconfont" :class="model.FlagClass.value">{{ Icons.Flag_Planar }}</div>
    </div>
</template>

<script setup lang="ts">
import { shallowRef, type PropType } from 'vue'
import { Icons } from '../../base'
import { ComponentHelper } from '../../helpers'
import { MarkerModel } from '../../models/Map/MarkerModel'

//字段:
const { model } = defineProps({
    model: {
        type: Object as PropType<MarkerModel<any, any>>,
        default: () => new MarkerModel()
    },
})

const refInfo = shallowRef<HTMLElement | undefined>()

const markerStyle: any = {
    width: `${MarkerModel.size}px`,
    height: `${MarkerModel.size}px`,
    borderRadius: `${MarkerModel.size / 2}px`,
}

const infoStyle: any = {
    top: `${MarkerModel.size}px`,
    left: `${MarkerModel.size}px`,
}

function OnClick() {
    model.onClick?.(model.data)
}

const InitInfo = () => {
    if (model.info && refInfo.value && refInfo.value.children.length < 1) {
        const app = ComponentHelper.CreateApp(model.info, { model: model.infoModel })
        if (!app) {
            console.warn('The app is undefined!')
            return
        }
        app.mount(refInfo.value)
    }
}
</script>

<style scoped lang="less">
.marker {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 12px;
    border: 1px solid hsl(180, 100%, 40%);
    box-shadow: hsl(180, 100%, 50%) 0px 0px 3px;
    background-color: hsla(180, 100%, 50%, 0.3);

    &:hover .info {
        display: block;
    }

    .info {
        display: none;
        position: absolute;
    }

    .flag {
        display: none;
        position: absolute;
        left: 50%;
        bottom: 50%;
        font-size: 18px;

        &.start {
            display: block;
            color: var(--color-success);
        }

        &.end {
            display: block;
            color: var(--color-danger);
        }
    }
}
</style>
