<template>
  <div class="main-panel">
    <!-- 左侧: -->
    <div class="left-panel">
      <!-- 导航栏: -->
      <NavBar :model="model.nav" :title="AppConfig.Title">
        <div class="footer-panel flex-center">
          <div class="button-panel flex-center">
            <IconButton :iconSize="18" :fontSize="14" :icon="Icons.Skin" :text="Texts.Theme.value"
              :click="ThemeHelper.Toggle" />
            <IconButton :iconSize="18" :fontSize="14" :icon="Icons.Global_Linear" :text="Texts.Language.value"
              :click="config.ToggleLocale" />
          </div>
          <span class="version">{{ Texts.Version.value }}{{ AppConfig.Version }}</span>
        </div>
      </NavBar>
    </div>

    <!-- 右侧: -->
    <div class="right-panel">
      <!-- 顶部: -->
      <div class="top-panel">
        <!-- 按钮: -->
        <button class="nav-button square-button" @click="model.nav.btnNavSwitch_Click">{{ Icons.Menu }}</button>

        <div class="info-panel flex-right">
          <IconButton :icon="Icons.Question" :text="Texts.Help.value" />
          <IconButton :icon="Icons.Refresh" :text="Texts.Progress.value" />
          <IconButton :icon="Icons.User" text="user" />
          <IconButton :icon="Icons.StartUp" text="" />
        </div>
      </div>

      <div class="page-bar-panel">
        <!-- 页标签栏: -->
        <PageBar :model="model.nav" />
      </div>

      <!-- 页面: -->
      <div class="page-panel flex-stretch">
        <PageView :model="model.nav" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { config, Icons, IconButton, NavBar, Texts, ThemeHelper, PageBar, PageView } from '../../packages'
import { HomeModel } from './HomeModel'
import AppConfig from '../../../AppConfig'

const model = new HomeModel()
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
    background: var(--theme-card-background);
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

.footer-panel {
  flex-direction: column;

  .version {
    margin-top: 10px;
    font-size: 12px;
    color: var(--theme-color-placeholder);
  }
}
</style>