<template>
    <DictionaryPage :model="dictionaryModel"></DictionaryPage>
</template>

<script lang="ts" setup>
import { DictionaryPage, DictionaryModel } from '@/0_tigersan_ui/tigerui'
import { stationTypeHelper } from '@/models'

const dictionaryModel = new DictionaryModel('基站类型', stationTypeHelper)
</script>

<style lang="less" scoped></style>