<template>
    <div class="loading pop-mask">
        <div class="icon iconfont" :style="styleObj">{{ Icons.Loading_Dot }}</div>
    </div>
</template>

<script lang="ts" setup>
import { Icons } from '../../base'

// 字段:
const { fontSize } = defineProps({
    fontSize: {
        type: Number,
        default: 50
    }
})

const styleObj = {
    'font-size': `${fontSize}px`
}
</script>

<style lang="less" scoped>
.loading {
    z-index: 9999;

    .icon {
        position: absolute;
        color: var(--theme-brand);
        transform-origin: center;
        animation: rotate 1.5s linear infinite;
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>