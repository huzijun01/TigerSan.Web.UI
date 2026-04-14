<template>
    <DictionaryPage :model="dictionaryModel"></DictionaryPage>
</template>

<script lang="ts" setup>
import { DictionaryPage, DictionaryModel } from '@/0_tigersan_ui/tigerui'
import { scenarioHelper } from '@/models'

const dictionaryModel = new DictionaryModel('场景', scenarioHelper)
</script>

<style lang="less" scoped></style>