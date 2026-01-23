<template>
    <div class="page-view">
    </div>
</template>

<script lang="ts">
import { defineComponent, h, type PropType, type Component } from 'vue'

export default defineComponent({
    props: {
        content: {
            type: [Object, null] as PropType<Component | null>,
            default: null
        }
    },
    setup(props) {
        // 创建 VNode:
        const vn = props.content ? h(props.content) : null;

        // 返回渲染函数，将 VNode 插入指定位置:
        return () => h(
            'div',
            { class: 'content' },
            vn ? [vn] : ["No Content"] // 将 VNode 作为子节点插入
        );
    }
});
</script>

<style lang="less" scoped>
.page-view {
    margin: 10px;
}
</style>