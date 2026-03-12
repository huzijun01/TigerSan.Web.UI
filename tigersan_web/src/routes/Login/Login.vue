<template>
  <div class="login-panel full-view">
    <div class="pic-panel flex-center full-view">
      <Lottie></Lottie>
    </div>
    <div class="form-panel flex-center full-view">
      <LoginForm></LoginForm>
    </div>
    <div class="info-panel flex-left" ref="refInfoPanel">
      <IconButton :icon="Icons.Skin" text="主题" :click="ThemeHelper.Toggle"></IconButton>
      <IconButton :icon="Icons.Global_Linear" text="语言" :click="config.ToggleLocale"></IconButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LoginForm from './LoginForm.vue'
import { ThemeHelper, IconButton, Icons, Lottie, config } from '@/0_tigersan_ui/tigerui'
</script>

<style lang="less" scoped>
.login-panel {
  position: relative;
  background: var(--theme-panel-background);

  .pic-panel {
    position: absolute;
    display: grid;
    grid-template-columns: 1.5fr 1fr;

    .lottie-panel {
      min-width: 600px;
      min-height: 500px;
    }
  }

  .form-panel {
    position: absolute;
    display: grid;
    grid-template-columns: 1fr auto;

    .login-form-panel {
      grid-column: 2/3;
      margin: 0 170px;
    }
  }

  .info-panel {
    position: absolute;
    margin: 35px 0px 0px 35px;

    &>* {
      margin-right: 15px;
    }
  }
}
</style>