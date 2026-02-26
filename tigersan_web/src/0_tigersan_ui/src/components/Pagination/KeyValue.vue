<template>
    <div class="key-value" :style="marginRightStyle">
        <span>{{ propName }}</span>
        <span>{{ Texts.Colon }}</span>
        <span :style="colorStyle">{{ propValue }}</span>
    </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import { Texts } from '../../text'
// 字段:
let { propName, propValue, color, marginRight } = defineProps({
    propName: {
        type: String,
        default: 'name'
    },
    propValue: {
        type: [String, Number, Boolean, Object, Array, Symbol, Function, Date, null] as PropType<any>,
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