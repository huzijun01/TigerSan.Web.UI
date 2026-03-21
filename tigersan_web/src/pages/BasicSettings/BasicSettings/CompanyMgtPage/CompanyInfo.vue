<template>
    <div class="company-info">
        {{ model.name }}
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { CompanyModel } from '@/pages/BasicSettings/BasicSettings/CompanyMgtPage/CompanyMgtTable'

//字段:
const { model } = defineProps({
    model: {
        type: Object as PropType<CompanyModel>,
        default: () => new CompanyModel()
    },
})
</script>

<style lang="less" scoped>
// .company-info {
    
// }
</style>