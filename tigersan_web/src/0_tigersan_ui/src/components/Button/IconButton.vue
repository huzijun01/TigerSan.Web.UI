<template>
    <div class="icon-button flex-center" @click="OnClick">
        <div class="icon iconfont" v-if="isShowIcon">{{ icon }}</div>
        <div class="text ellipsis" v-if="isShowText">{{ text }}</div>
    </div>
</template>
<script lang="ts" setup>
import { Icons } from '../../base'
import { computed } from 'vue';

let { icon, text, click } = defineProps({
    icon: {
        type: String,
        default: Icons.About
    },
    text: {
        type: String,
        default: 'Button'
    },
    click: {
        type: Function,
    }
})

const isShowIcon = computed(() => {
    return icon.trim() != ''
})

const isShowText = computed(() => {
    return text.trim() != ''
})

function OnClick(payload: PointerEvent) {
    if (click) {
        click(payload)
    }
}
</script>
<style lang="less" scoped>
@size: 24px;

.icon-button {
    cursor: pointer;

    &:hover {
        * {
            color: var(--theme-brand);
        }
    }

    * {
        line-height: 1;
    }

    .icon {
        width: @size;
        height: @size;
        font-size: @size;
    }

    .text {
        margin: 0 10px;
        max-width: 200px;
    }
}
</style>
