<template>
    <Teleport to="body">
        <div class="pop-mask" v-if="isShow">
            <slot></slot>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
let { isShow } = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
})
</script>

<style lang="less" scoped>
.pop-mask {
    position: absolute;
    /* 显示 */
    display: flex;
    /* 对齐 */
    align-items: center;
    justify-content: center;
    /* 尺寸 */
    width: 100vw;
    height: 100vh;
    /* 颜色 */
    background: rgba(0, 0, 0, 0.1);
    // backdrop-filter: blur(1px);
    /* 置顶 */
    z-index: 999;
}
</style>