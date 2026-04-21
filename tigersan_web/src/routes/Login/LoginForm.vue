<template>
  <div class="login-form-panel">
    <div class="title flex-center ellipsis">{{ AppConfig.Title }}</div>
    <div class="content-panel flex-stretch">
      <Form :marginH="0">
        <FormRow>
          <FormItem :model="form.configUsername.ItemModel">
            <TextBox type="text" :model="form.uname"></TextBox>
          </FormItem>
        </FormRow>
        <FormRow>
          <FormItem :model="form.configPassword.ItemModel">
            <Password :model="form.pwd"></Password>
          </FormItem>
        </FormRow>
        <FormRow>
          <FormItem :model="form.configCaptcha.ItemModel">
            <div class="captcha-panel">
              <TextBox type="text" :model="form.captcha"></TextBox>
              <img class="captcha-img" src="http://www.tigersan.cn/0_file/image/captcha.jpg" alt="">
            </div>
          </FormItem>
        </FormRow>
      </Form>
    </div>
    <div class="button-panel flex-stretch">
      <button @click="form.loginForm.OnSubmit">{{ Texts.Login.value }}</button>
      <div class="code-login link flex-right">{{ Texts.VerificationCodeLogin.value }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import form from './LoginForm'
import AppConfig from '@/AppConfig'
import { onMounted } from 'vue'
import { useUserInfo } from '@/stores'
import { Texts, Form, FormRow, FormItem, TextBox, Password } from '@/0_tigersan_ui/tigerui'

onMounted(() => {
  const userInfo = useUserInfo()
  userInfo.Clear()
  form.loginForm.Init()
})
</script>

<style lang="less" scoped>
@padding: 15px;

.login-form-panel {
  padding: @padding;
  border-radius: 15px;
  background: var(--theme-card-background);

  .title {
    padding: 30px 30px 0px 30px;
    font-size: 32px;
    font-weight: bold;
  }

  .content-panel {
    .form-panel {
      margin: 0px;

      #pwd {
        width: 100%;
        vertical-align: middle;
      }

      .captcha-panel {
        display: grid;
        grid-column: 1fr auto;

        .textbox {
          grid-column: 1/2;
          margin-right: 5px;
        }

        .captcha-img {
          grid-column: 2/3;
          height: 35px;
          width: 87.5px;
          cursor: pointer;
        }
      }
    }
  }

  .button-panel {
    flex-direction: column;

    .code-login {
      padding-top: @padding;
    }
  }
}
</style>