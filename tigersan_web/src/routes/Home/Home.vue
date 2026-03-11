<template>
  <div class="main-panel">
    <!-- 左侧: -->
    <div class="left-panel">
      <!-- 导航栏: -->
      <NavBar :model="navModel" :title="AppConfig.Title">
        <div class="footer-panel flex-center">
          <span class="skin iconfont" @click="ThemeHelper.Toggle">{{ Icons.Skin }}</span>
          <span class="version">版本：V{{ AppConfig.Version }}</span>
        </div>
      </NavBar>
    </div>

    <!-- 右侧: -->
    <div class="right-panel">
      <!-- 顶部: -->
      <div class="top-panel">
        <!-- 按钮: -->
        <button class="nav-button square-button" @click="navModel.btnNavSwitch_Click">{{ Icons.Menu }}</button>

        <div class="info-panel flex-right" ref="refInfoPanel">
          <IconButton :icon="Icons.Setting_Linear" text="基础设置" :click="navData.GoBaseSetting"></IconButton>
          <IconButton :icon="Icons.Question" text="帮助"></IconButton>
          <IconButton :icon="Icons.Refresh" text="进度"></IconButton>
          <IconButton :icon="Icons.User" :text="userName"></IconButton>
          <IconButton :icon="Icons.Output" text="" :click="OnExit"></IconButton>
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
</template>

<script lang="ts" setup>
import AppConfig from '@/AppConfig'
import { onBeforeMount, onMounted, ref } from 'vue'
import { useUserInfo } from '@/stores'
import { Icons, IconButton, NavBar, PageBar, PageView, dialog, DialogMode, Colors, DialogState, useRouter, ThemeHelper } from '@/0_tigersan_ui/tigerui'
import { IsUserInfoVerifyOk } from '@/models'
import { navModel, navData } from '@/navs/navModel'

// 字段:
const userName = ref('')
const userInfo = useUserInfo()

// 过程:
onBeforeMount(() => {
  if (!IsUserInfoVerifyOk(userInfo)) {
    useRouter().GoTo('Login')
    return
  }
})

onMounted(() => {
  userName.value = userInfo.UserName
})

// 方法:
function OnExit() {
  dialog.ShowDialog(
    '确认',
    '是否要退出登录？',
    undefined,
    Login,
    DialogMode.YesOrNo,
    Colors.Warning)
}

function Login(state: DialogState) {
  if (state != DialogState.Yes) return
  useRouter().GoTo('Login')
}
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