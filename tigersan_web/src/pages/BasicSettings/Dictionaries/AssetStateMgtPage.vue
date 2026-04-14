<template>
    <DictionaryPage :model="dictionaryModel"></DictionaryPage>
</template>

<script lang="ts" setup>
import { DictionaryPage, DictionaryModel } from '@/0_tigersan_ui/tigerui'
import { assetStateHelper } from '@/models'

const dictionaryModel = new DictionaryModel('资产状态', assetStateHelper)
</script>

<style lang="less" scoped></style>