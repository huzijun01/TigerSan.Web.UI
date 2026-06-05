<template>
    <div v-if="isShow" class="key-value ellipsis" :style="marginRightStyle">
        <span>{{ propName }}</span>
        <span>{{ Texts.Colon.value }}</span>
        <span :style="ColorStyle">{{ propValue }}</span>
    </div>
</template>

<script lang="ts" setup>
import { computed, type PropType, type StyleValue } from 'vue'
import { Theme } from '../../base'
import { Texts } from '../../texts'
import { AnyTypes } from '../../types'
import { StringHelper } from '../../helpers';

// 字段:
let { propName, propValue, color, marginRight, isAutoHidden } = defineProps({
    propName: {
        type: String,
        default: 'name'
    },
    propValue: {
        type: AnyTypes as PropType<any>,
        default: ''
    },
    color: {
        type: String,
        default: Theme.Brand
    },
    marginRight: {
        type: Number,
        default: 15
    },
    isAutoHidden: {
        type: Boolean,
        default: false
    }
})

const ColorStyle: StyleValue = {
    'color': color,
    'user-select': 'text',
}

const marginRightStyle: StyleValue = {
    'marginRight': `${marginRight}px`,
}

const isShow = computed(() => { return !(isAutoHidden && !StringHelper.IsNotEmpty(propValue)) })
</script>

<style lang="less" scoped></style>