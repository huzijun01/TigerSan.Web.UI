<template>
    <div class="tree-panel">
        <TreeNode v-for="n in model.Nodes" :key="n._id" :model="n"></TreeNode>
    </div>
</template>

<script lang="ts" setup>
import TreeNode from './TreeNode.vue'
import { TreeModel } from '../../models'

// 字段:
const { model } = defineProps({
    model: {
        type: TreeModel<any>,
        default: () => new TreeModel<any>()
    }
})

</script>

<style lang="less" scoped>
.tree-panel {
    display: grid;
}
</style>
