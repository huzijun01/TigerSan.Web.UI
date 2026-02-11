<template>
  <div class="main-panel">
    <!-- 左侧: -->
    <div class="left-panel">
      <!-- 导航栏: -->
      <NavBar :model="navBarModel" :title="AppConfig.Title">
        <div class="footer-panel flex-center">
          <span class="version">版本：V{{ AppConfig.Version }}</span>
        </div>
      </NavBar>
    </div>

    <!-- 右侧: -->
    <div class="right-panel">
      <!-- 顶部: -->
      <div class="top-panel">
        <!-- 按钮: -->
        <button class="square-button" @click="navBarModel.btnNavSwitch_Click">{{ Icons.Menu }}</button>

        <!-- 页标签栏: -->
        <PageBar :model="navBarModel" :offsetX="offsetX" />

        <div class="info-panel flex-center" ref="refInfoPanel">
          <IconButton :icon="Icons.Question" text="帮助"></IconButton>
          <IconButton :icon="Icons.Refresh" text="进度"></IconButton>
          <IconButton :icon="Icons.User" :text="userName"></IconButton>
          <IconButton :icon="Icons.Output" text="" :click="OnExit"></IconButton>
        </div>
      </div>

      <!-- 页面: -->
      <div class="page-panel flex-stretch">
        <PageView :model="navBarModel" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppConfig from '@/AppConfig'
import navBarModel from '@/navBarModel'
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfo } from '@/stores'
import { Icons, IconButton, NavBar, PageBar, PageView } from '@/tigerui'
import { IsUserInfoVerifyOk } from '@/models'

// 字段:
const userName = ref('')
const offsetX = ref(0)
const refInfoPanel = ref<HTMLElement | undefined>()
const router = useRouter()
const userInfo = useUserInfo()

// 过程:
onBeforeMount(() => {
  if (!IsUserInfoVerifyOk(userInfo)) {
    router.replace('Login')
    return
  }
})

onMounted(() => {
  if (!refInfoPanel.value) {
    console.log('The refInfoPanel is undefined!')
    return
  }

  offsetX.value = 35 + (refInfoPanel.value?.offsetWidth ?? 0)
  userName.value = userInfo.UserName
})

// 方法:
function OnExit() {
  router.replace('Login')
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
    grid-column: 1/2;
    height: 100%;
  }

  .right-panel {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-column: 2/3;

    .top-panel {
      display: flex;
      align-items: flex-start;
      grid-row: 1/2;
      background: var(--theme-card-background);

      &>button {
        flex-shrink: 0;
      }

      .info-panel {
        align-self: center;

        &>* {
          margin-right: 15px;
        }
      }
    }

    .page-panel {
      grid-row: 2/3;
      background: var(--theme-panel-background);
      overflow: hidden;
    }
  }
}

.version {
  font-size: 12px;
  color: var(--color-primary-text);
}
</style>