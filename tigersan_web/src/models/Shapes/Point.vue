<template>
    <text class="iconfont" :x="model.X.value" :y="model.Y.value" :fill="model.Fill.value">
        {{ model.Text.value }}
    </text>
</template>

<script lang="ts" setup>
import { PointModel } from './Shapes'

// 字段:
const { model } = defineProps({
    model: {
        type: PointModel,
        default: new PointModel()
    }
})

// 方法:
</script>

<style lang="less" scoped>
text {
    cursor: pointer;
    text-anchor: middle;
    dominant-baseline: middle;
    box-shadow: var(--color-box-shadow) 0px 0px 3px;

    &:hover {
        fill: var(--color-danger);
    }
}
</style>