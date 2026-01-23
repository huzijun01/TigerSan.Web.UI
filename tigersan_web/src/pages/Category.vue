<template>
    <div class="category">
        <h2>{{ title }}</h2>
        <slot>默认内容</slot>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';

// 数据：

// 接收数据：
defineProps(['title'])
</script>

<style scoped>
.category {
    width: 200px;
    min-height: 200px;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: darkseagreen;
}

h2 {
    text-align: center;
    background-color: orange;
}
</style>