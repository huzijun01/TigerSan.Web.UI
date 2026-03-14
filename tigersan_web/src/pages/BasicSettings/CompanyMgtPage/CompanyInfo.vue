<template>
    <div class="company-info">
        {{ model.name }}
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { CompanyMgtModel } from '@/pages/BasicSettings/CompanyMgtPage/CompanyMgtTable'

//字段:
const { model } = defineProps({
    model: {
        type: Object as PropType<CompanyMgtModel>,
        default: () => new CompanyMgtModel()
    },
})
</script>

<style lang="less" scoped>
// .company-info {
    
// }
</style>