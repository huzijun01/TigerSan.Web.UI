<template>
    <div class="loading pop-mask">
        <div class="icon iconfont">{{ Icons.Loading_Dot }}</div>
    </div>
</template>

<script lang="ts" setup>
import { Icons } from '../../base'
</script>

<style lang="less" scoped>
.loading {
    z-index: 9999;

    .icon {
        position: absolute;
        font-size: 50px;
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