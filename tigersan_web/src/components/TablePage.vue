<template>
    <div class="table-page flex-center">
        TablePage
    </div>
</template>

<script lang="ts" setup>
import { dialog } from '@/0_tigersan_ui/stores/dialog'
import { ref } from 'vue'

let sum = ref(0)

function Add() {
    ++sum.value
    dialog.ShowInformation(`sum = ${sum.value}`)
}
</script>

<style lang="less" scoped>
// .table-page {
// }</style>