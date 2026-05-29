<template>
    <div class="company-info">
        <div>ID：{{ model.id }}</div>
        <div>名称：{{ model.name }}</div>
        <div>地址：{{ model.addr }}</div>
    </div>
</template>

<script lang="ts" setup>
import { CompanyModel } from '@/models'
import { type PropType } from 'vue'

//字段:
const { model } = defineProps({
    model: {
        type: Object as PropType<CompanyModel>,
        default: () => new CompanyModel()
    },
})
</script>

<style lang="less" scoped>
.company-info {
    padding: 10px;
    line-height: 1.5;
}
</style>