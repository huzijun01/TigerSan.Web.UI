<template>
    <div class="panel">
        <h2>Child</h2>
        <div>sum = {{ sum }}</div>
        <button @click="Add">Add</button>
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
button {
    margin-top: 15px;
}
</style>