<template>
    <div class="key-value" :style="marginRightStyle">
        <span>{{ propName }}</span>
        <span>{{ Texts.Colon.value }}</span>
        <span :style="colorStyle">{{ propValue }}</span>
    </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import { Theme } from '../../base'
import { Texts } from '../../texts'
import { AnyTypes } from '../../types'

// 字段:
let { propName, propValue, color, marginRight } = defineProps({
    propName: {
        type: String,
        default: 'name'
    },
    propValue: {
        type: AnyTypes as PropType<any>,
        default: 'value'
    },
    color: {
        type: String,
        default: Theme.Brand
    },
    marginRight: {
        type: Number,
        default: 15
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