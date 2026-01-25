<template>
  <div class="main-panel">
    <!-- 左侧: -->
    <div class="left-panel">
      <!-- 导航栏: -->
      <NavBar :model="navBarModel" />
    </div>

    <!-- 右侧: -->
    <div class="right-panel">
      <!-- 顶部: -->
      <div class="top-panel">
        <!-- 按钮: -->
        <button class="square-button" @click="navBarModel.btnNavSwitch_Click">{{ Icons.Menu }}</button>

        <!-- 页标签栏: -->
        <PageBar :model="navBarModel" />
      </div>

      <!-- 页面: -->
      <div class="page-panel flex-stretch">
        <PageView :model="navBarModel" />
      </div>
    </div>
  </div>
  <Dialog></Dialog>
</template>

<script lang="ts" setup>
import navBarModel from '@/navBarModel'
import { Icons } from '@/0_tigersan_ui/base'
import { Dialog, NavBar, PageBar, PageView } from '@/0_tigersan_ui/components'
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
    background: var(--color-light-fill);
  }

  .right-panel {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-column: 2/3;

    .top-panel {
      display: flex;
      align-items: flex-start;
      grid-row: 1/2;
      background: var(--color-light-fill);
    }

    .page-panel {
      grid-row: 2/3;
      background: var(--color-base-fill);
      overflow: hidden;
    }
  }
}
</style>