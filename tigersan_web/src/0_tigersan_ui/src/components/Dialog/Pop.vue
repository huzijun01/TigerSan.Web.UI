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
    backdrop-filter: none;
}
</style>