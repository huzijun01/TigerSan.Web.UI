<template>
    <table class="form-panel">
        <tbody>
            <slot></slot>
        </tbody>
    </table>
</template>

<script lang="ts" setup>
</script>

<style lang="less" scoped>
@margin-bottom: 25px;
@margin-right: 20px;

table {
    border-collapse: separate;
    border-spacing: @margin-right @margin-bottom;
}
</style>