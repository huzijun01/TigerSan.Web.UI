<template>
    <div class="key-value" :style="marginRightStyle">
        <span>{{ name }}</span>
        <span>{{ Texts.Colon }}</span>
        <span :style="colorStyle">{{ value }}</span>
    </div>
</template>

<script lang="ts" setup>
import { Texts } from '../../text'

// 字段:
let { name, value, color, marginRight } = defineProps({
    name: {
        type: String,
        default: 'name'
    },
    value: {
        type: Object as any,
        default: 'value'
    },
    color: {
        type: String,
        default: 'var(--theme-brand)'
    },
    marginRight: {
        type: Number,
        default: 10
    }
})

const colorStyle = {
    'color': color,
}

const marginRightStyle = {
    'marginRight': `${marginRight}px`,
}
</script>

<style lang="less" scoped></style>