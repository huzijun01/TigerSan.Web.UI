<template>
  <div class="login-panel full-view">
    <div class="bottom-panel flex-center full-view">
      <Lottie></Lottie>
    </div>
    <div class="top-panel flex-center full-view">
      <LoginForm></LoginForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Lottie } from '@/0_tigersan_ui/tigerui'
import LoginForm from './LoginForm.vue'
</script>

<style lang="less" scoped>
.login-panel {
  position: relative;
  background: var(--theme-panel-background);

  .bottom-panel {
    position: absolute;
    display: grid;
    grid-template-columns: 1.5fr 1fr;

    .lottie-panel {
      min-width: 600px;
      min-height: 500px;
    }
  }

  .top-panel {
    position: absolute;
    display: grid;
    grid-template-columns: 1fr auto;

    .login-form-panel {
      grid-column: 2/3;
      margin: 0 170px;
    }
  }
}
</style>