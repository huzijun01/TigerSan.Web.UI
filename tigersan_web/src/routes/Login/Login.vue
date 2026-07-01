<template>
  <div class="login-panel full-view">
    <div class="pic-panel flex-center full-view">
      <Lottie></Lottie>
    </div>
    <div class="form-panel flex-center full-view">
      <LoginForm></LoginForm>
    </div>
    <div class="info-panel flex-left" ref="refInfoPanel">
      <IconButton :icon="Icons.Skin" :text="Texts.Theme.value" :click="ThemeHelper.Toggle"></IconButton>
      <IconButton :icon="Icons.Global_Linear" :text="Texts.Language.value" :click="config.ToggleLocale"></IconButton>
    </div>
    <div class="company-panel flex-center">
      <span>© 2026 深圳市大业工业设备有限公司</span>
      <span class="separator">|</span>
      <a href=" " target="_blank" rel="noopener noreferrer" class="beian-link">粤ICP备2023066306号-3</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { loginFormModel as model } from './LoginFormModel'
import LoginForm from './LoginForm.vue'
import { onBeforeMount } from 'vue';
import { ThemeHelper, IconButton, Icons, Lottie, config, Texts } from '@/0_tigersan_ui/tigerui'

onBeforeMount(() => {
  model.LoginByToken()
})
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

  .company-panel {
    position: absolute;
    bottom: 0;
    width: 100%;
    margin-bottom: 25px;

    &>* {
      color: var(--theme-color-placeholder);
    }
  }
}
</style>