<template>
    <div class="nav-panel" ref="refRoot" :style="{ 'width': strWidth }">
        <!-- Logo: -->
        <div class="loge-panel">
            <!-- 遮罩: -->
            <div class="mask">
                <!-- 图片: -->
                <img class="logo" :src="logo" />

                <!-- 文本: -->
                <div class="title">{{ title }}</div>
            </div>
        </div>

        <!-- 临时菜单: -->
        <div class="temp-menu">
            <NavFolder ref="refFolder" />
            <NavButton ref="refButton" />
        </div>

        <!-- 菜单: -->
        <div class="menu">
            <NavFolder v-for="f in model.FolderModel.FolderModels" :key="f._id" :model="f" />
            <NavButton v-for="b in model.FolderModel.ButtonModels" :key="b._id" :model="b" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { NavButton, NavFolder } from '../../components'
import { NavBarModel } from '../../models'

// 字段:
const refRoot = ref<HTMLElement | undefined>()
const refFolder = ref<typeof NavFolder>()
const refButton = ref<typeof NavButton>()

let { logo, title, model } = defineProps({
    logo: {
        type: String,
        default: "/favicon.ico"
    },
    title: {
        type: String,
        default: "TigerSan"
    },
    model: {
        type: NavBarModel,
        default: new NavBarModel()
    }
})

const strWidth = ref(`${model.Width.value}px`)

// 监听:
watch(model.IsOpen, () => {
    UpdateWidthString()
})

// 过程:
model._getNavWidth = GetWidth

onMounted(() => {
    AddHeightGetter()
    model.UpdateHeight()
    UpdateWidthString()
})

// 方法:
function AddHeightGetter() {
    model._getFolderHeight = () => refFolder.value?.GetHeight()
    model._getButtonHeight = () => refButton.value?.GetHeight()
}

function UpdateWidthString() {
    strWidth.value = model.IsOpen.value ? `${model.Width.value}px` : `0px`
}

function GetWidth(): number {
    return refRoot.value?.offsetWidth ?? 0
}
</script>

<style lang="less" scoped>
@loge-size: 25px;
@loge-panel-padding: 10px;

.nav-panel {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    overflow: hidden;
    transition: var(--Global-Duration);

    .loge-panel {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-row: 1 / 2;
        padding: @loge-panel-padding 0px;

        .mask {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            .logo {
                width: @loge-size;
                height: @loge-size;
                margin-right: 5px;
            }

            .title {
                font-size: 16px;
            }
        }
    }

    .temp-menu {
        grid-row: 2 / 3;
        position: absolute;
        /* 透明: */
        opacity: 0;
        /* 禁用鼠标事件: */
        pointer-events: none;
    }

    .menu {
        grid-row: 2 / 3;
        height: calc(100vh - @loge-size - @loge-panel-padding * 2);
        overflow: auto;
    }
}
</style>