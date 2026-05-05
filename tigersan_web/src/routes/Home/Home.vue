<template>
  <div class="main-panel">
    <!-- 左侧: -->
    <div class="left-panel">
      <!-- 导航栏: -->
      <NavBar :model="navModel" :title="AppConfig.Title">
        <div class="footer-panel flex-center">
          <span class="skin iconfont" @click="ThemeHelper.Toggle">{{ Icons.Skin }}</span>
          <span class="version">{{ Texts.Version.value }}{{ AppConfig.Version }}</span>
        </div>
      </NavBar>
    </div>

    <!-- 右侧: -->
    <div class="right-panel">
      <!-- 顶部: -->
      <div class="top-panel">
        <!-- 按钮: -->
        <button class="nav-button square-button" @click="navModel.btnNavSwitch_Click">{{ Icons.Menu }}</button>

        <div class="info-panel flex-right">
          <KeyValue :isAutoHidden="true" propName="公司" :propValue="userInfo.companyIdName.name" />
          <IconButton v-if="!navData.IsAtHome.value" :icon="Icons.Building_2" :text="Texts.EnterCompany.value"
            :click="navData.InitHome" />
          <IconButton v-if="navData.IsAtHome.value" :icon="Icons.Setting_Linear" :text="Texts.BasicSettings.value"
            :click="navData.InitBasicSettings" />
          <IconButton :icon="Icons.Global_Linear" :text="Texts.Language.value" :click="config.ToggleLocale" />
          <IconButton :icon="Icons.Question" :text="Texts.Help.value" />
          <IconButton :icon="Icons.Refresh" :text="Texts.Progress.value" />
          <IconButton :icon="Icons.User" :text="userInfo.nickname" :click="form.Edit" />
          <IconButton :icon="Icons.StartUp" text="" :click="loginForm.Logout" />
        </div>
      </div>

      <div class="page-bar-panel">
        <!-- 页标签栏: -->
        <PageBar :model="navModel" />
      </div>

      <!-- 页面: -->
      <div class="page-panel flex-stretch">
        <PageView :model="navModel" />
      </div>
    </div>
  </div>

  <!-- 表单（修改用户信息）: -->
  <PopForm :model="form.userInfoForm">
    <FormRow>
      <FormItem :model="form.configCompany.ItemModel">
        <input type="text" disabled v-model="form.configCompany.Target.value">
      </FormItem>
    </FormRow>
    <FormRow v-if="!userInfo.isAdmin">
      <FormItem :model="form.configDepartment.ItemModel">
        <input type="text" disabled v-model="form.configDepartment.Target.value">
      </FormItem>
    </FormRow>
    <FormRow>
      <FormItem :model="form.configRole.ItemModel">
        <input type="text" disabled v-model="form.configRole.Target.value">
      </FormItem>
    </FormRow>
    <FormRow>
      <FormItem :model="form.configUsername.ItemModel">
        <input type="text" v-model="form.configUsername.Target.value">
      </FormItem>
    </FormRow>
    <FormRow v-if="!userInfo.isAdmin">
      <FormItem :model="form.configTagId.ItemModel">
        <input type="text" v-model="form.configTagId.Target.value">
      </FormItem>
    </FormRow>
    <FormRow v-if="!userInfo.isAdmin">
      <FormItem :model="form.configPhone.ItemModel">
        <input type="text" v-model="form.configPhone.Target.value">
      </FormItem>
    </FormRow>
    <FormRow v-if="!userInfo.isAdmin">
      <FormItem :model="form.configMail.ItemModel">
        <input type="text" v-model="form.configMail.Target.value">
      </FormItem>
    </FormRow>
    <FormRow>
      <button @click="passwordForm.Edit">{{ Texts.ChangePassword.value }}</button>
    </FormRow>
  </PopForm>

  <!-- 表单（修改密码）: -->
  <PopForm :model="passwordForm.passwordForm">
    <FormRow>
      <FormItem :model="passwordForm.configOldPassword.ItemModel">
        <Password :model="passwordForm.oldPassword" />
      </FormItem>
    </FormRow>
    <FormRow>
      <FormItem :model="passwordForm.configPassword.ItemModel">
        <Password :model="passwordForm.password" />
      </FormItem>
    </FormRow>
    <FormRow>
      <FormItem :model="passwordForm.configConfirmPassword.ItemModel">
        <Password :model="passwordForm.confirmPassword" />
      </FormItem>
    </FormRow>
  </PopForm>
</template>

<script lang="ts" setup>
import form from './UserInfoForm'
import AppConfig from '@/AppConfig'
import passwordForm from './PasswordForm'
import loginForm from '@/routes/Login/LoginForm'
import { onBeforeMount, onMounted } from 'vue'
import { UserHelper } from '@/models'
import { useUserInfo } from '@/stores'
import { navModel, navData } from '@/navs/navModel'
import { PopForm, FormRow, Password, FormItem, Texts, Icons, IconButton, NavBar, PageBar, PageView, useRouter, ThemeHelper, config, KeyValue } from '@/0_tigersan_ui/tigerui'

// 字段:
/** 用户信息 */
const userInfo = useUserInfo()

// 过程:
onBeforeMount(() => {
  if (!UserHelper.IsUserInfoVerifyOk(userInfo)) {
    useRouter().GoTo('/')
    return
  }
})

onMounted(() => {
})
</script>

<style lang="less" scoped>
.main-panel {
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .left-panel {
    height: 100%;
  }

  .right-panel {
    display: grid;
    grid-template-rows: auto auto 1fr;

    .top-panel {
      display: grid;
      grid-template-columns: auto 1fr;
      background: var(--theme-card-background);

      .nav-button {
        z-index: 1;
      }

      .info-panel {
        overflow: auto;

        &>* {
          margin-right: 15px;
        }
      }
    }

    .page-bar-panel {
      background: var(--theme-card-background);
    }

    .page-panel {
      overflow: hidden;
      background: var(--theme-panel-background);
    }
  }
}

.skin {
  cursor: pointer;
  margin-right: 10px;
}

.version {
  font-size: 12px;
  color: var(--theme-color);
}
</style>