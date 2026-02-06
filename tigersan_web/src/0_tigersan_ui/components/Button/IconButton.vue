<template>
    <div class="icon-button flex-center">
        <div class="icon iconfont" v-if="isShowIcon">{{ icon }}</div>
        <div class="text" v-if="isShowText">{{ text }}</div>
    </div>
</template>
<script lang="ts" setup>
import { Icons } from '@/0_tigersan_ui/base'
import { computed } from 'vue';

let { icon, text } = defineProps({
    icon: {
        type: String,
        default: Icons.About
    },
    text: {
        type: String,
        default: 'Button'
    }
})

const isShowIcon = computed(() => {
    return icon.trim() != ''
})

const isShowText = computed(() => {
    return text.trim() != ''
})
</script>
<style lang="less" scoped>
@size: 28px;

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
    }
}
</style>
