<template>
    <PageCard>
        <div class="input-page">
            <Select :model="selectModel"></Select>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import { SelectModel } from '@/0_tigersan_ui/models'
import { Select, PageCard } from '@/0_tigersan_ui/components'
import { dialog } from '@/0_tigersan_ui/stores';

const selectModel = new SelectModel()
selectModel.Items.push(...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
selectModel._onSelect = itemModel => {
    dialog.ShowInformation(`Value = ${itemModel.Text.value}`)
}
</script>

<style lang="less" scoped></style>