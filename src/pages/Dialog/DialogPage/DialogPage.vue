<template>
  <PageCard>
    <div class="dialog flex-stretch">
      <button class="success" @click="DialogHelper.Success(Texts.Success.value)">{{ Texts.Success.value }}</button>
      <button class="warn" @click="DialogHelper.Warning(Texts.Warning.value)">{{ Texts.Warning.value }}</button>
      <button class="danger" @click="DialogHelper.Error(Texts.Error.value)">{{ Texts.Error.value }}</button>
      <button class="info" @click="DialogHelper.Information(Texts.Information.value)">
        {{ Texts.Information.value }}</button>
      <button class="info" @click="Show">{{ Texts.Dialog.value }}</button>
    </div>
  </PageCard>
</template>

<script lang="ts" setup>
import { PageCard, Texts, DialogHelper, DialogMode, DialogState } from '../../../packages'

function Show() {
  DialogHelper.Show(
    Texts.Dialog.value,
    'Yes or No?',
    123,
    (state, data) => { if (state === DialogState.Yes) DialogHelper.Information(data.toString()) },
    DialogMode.YesOrNo)
}
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