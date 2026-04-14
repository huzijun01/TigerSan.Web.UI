<template>
    <DictionaryPage :model="dictionaryModel"></DictionaryPage>
</template>

<script lang="ts" setup>
import { DictionaryPage, DictionaryModel } from '@/0_tigersan_ui/tigerui'
import { siteTypeHelper } from '@/models'

const dictionaryModel = new DictionaryModel('场地类型', siteTypeHelper)
</script>

<style lang="less" scoped></style>