<template>
    <PageCard>
        <div class="dialog flex-stretch">
            <button class="success" @click="ToastHelper.Success(Texts.Success.value)">{{ Texts.Success.value }}</button>
            <button class="warn" @click="ToastHelper.Warning(Texts.Warning.value)">{{ Texts.Warning.value }}</button>
            <button class="danger" @click="ToastHelper.Error(Texts.Error.value)">{{ Texts.Error.value }}</button>
            <button class="info" @click="ToastHelper.Info(Texts.Information.value)">
                {{ Texts.Information.value }}</button>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import { PageCard, Texts, ToastHelper } from '../../../packages'
</script>

<style lang="less" scoped>
.dialog {
    flex-direction: column;

    .success {
        background: var(--color-success);
    }

    .warn {
        background: var(--color-warning);
    }

    .danger {
        background: var(--color-danger);
    }
}
</style>