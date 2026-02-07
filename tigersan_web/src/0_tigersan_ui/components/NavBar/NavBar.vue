<template>
    <div class="nav-panel" ref="refRoot" :style="{ 'width': strWidth }">
        <!-- Logo: -->
        <div class="logo-panel">
            <!-- 遮罩: -->
            <div class="logo-mask">
                <!-- 图片: -->
                <div class="logo-border flex-center">
                    <img class="logo" :src="logo" />
                </div>

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

        <!-- 底部: -->
        <div class="footer">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { NavButton, NavFolder } from '../../components'
import { NavBarModel } from '../../models'
import { Constants } from '../../base'

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
        default: () => new NavBarModel()
    }
})

const strWidth = ref(`${model.Width.value}px`)

// 监听:
watch(model.IsOpen, () => {
    UpdateBodyClass()
    UpdateWidthString()
})

// 过程:
model._getNavWidth = GetWidth

onMounted(() => {
    AddHeightGetter()
    UpdateBodyClass()
    UpdateWidthString()
    model.UpdateHeight()
})

// 方法:
function AddHeightGetter() {
    model._getFolderHeight = () => refFolder.value?.GetHeight()
    model._getButtonHeight = () => refButton.value?.GetHeight()
}

function UpdateBodyClass() {
    if (model.IsOpen.value) {
        document.body.classList.add(Constants.NavOpen)
    } else {
        document.body.classList.remove(Constants.NavOpen)
    }
}

function UpdateWidthString() {
    strWidth.value = model.IsOpen.value ? `${model.Width.value}px` : `0px`
}

function GetWidth(): number {
    return refRoot.value?.offsetWidth ?? 0
}
</script>

<style lang="less" scoped>
@offset-x: 10px;
@logo-size: 25px;
@nav-padding: 15px;

.nav-panel {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100vh;
    overflow: hidden;
    transition: var(--Global-Transition);
    background: var(--theme-nav-background);
    border-radius: var(--theme-nav-logo-border-radius);

    // Logo:
    .logo-panel {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-row: 1 / 2;
        padding: @nav-padding @offset-x @nav-padding 0px;

        .logo-mask {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            .logo-border {
                border-radius: 5px;
                margin-right: 10px;
                padding: var(--theme-nav-logo-border-padding);
                background: var(--theme-nav-logo-border-background);

                .logo {
                    width: @logo-size;
                    height: @logo-size;
                }
            }

            .title {
                color: var(--theme-nav-color);
                font-size: 16px;
                font-weight: bold;
            }
        }
    }

    // 临时菜单:
    .temp-menu {
        /* 显示: */
        grid-row: 2 / 3;
        position: absolute;
        /* 透明: */
        opacity: 0;
        /* 禁用鼠标事件: */
        pointer-events: none;
    }

    // 菜单:
    .menu {
        /* 显示: */
        grid-row: 2 / 3;
        overflow: auto;
        /* 尺寸: */
        padding: 0px @nav-padding;
    }

    // 底部:
    .footer {
        /* 显示: */
        grid-row: 3 / 4;
        /* 尺寸: */
        padding: @nav-padding;
        padding: @nav-padding @nav-padding + @offset-x @nav-padding @nav-padding;
    }
}
</style>