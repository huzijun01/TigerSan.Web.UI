<template>
    <DictionaryPage :model="dictionaryModel"></DictionaryPage>
</template>

<script lang="ts" setup>
import { DictionaryPage, DictionaryModel } from '@/0_tigersan_ui/tigerui'
import { assetTypeHelper } from '@/models'

const dictionaryModel = new DictionaryModel('资产类型', assetTypeHelper)
</script>

<style lang="less" scoped></style>