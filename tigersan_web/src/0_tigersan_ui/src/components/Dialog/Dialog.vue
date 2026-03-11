<template>
    <Teleport to="body">
        <div class="dialog-mask" v-if="isShow">
            <div class="popPanel" v-for="m in dialogModels" :key="m.id" :style="{ borderColor: m.Color.value }">
                <div class="titlePanel" :style="{ background: m.Color.value }">
                    <div class="title">{{ m.Title }}</div>
                    <button class="btnClose btn_clear iconfont"
                        @click="Close(m.id, DialogState.Cancel)">&#xe639;</button>
                </div>
                <div class="content">{{ m.Msg }}</div>
                <div class="button-panel flex-stretch" v-if="m.IsShowButtonPanel.value">
                    <button class="yes bg-success" @click="Close(m.id, DialogState.Yes)">{{ m.YesText.value }}</button>
                    <button class="no bg-danger" v-if="m.IsShowNoButton.value" @click="Close(m.id, DialogState.No)">{{
                        m.NoText.value }}</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import { Teleport, computed, type ShallowReactive } from 'vue';
import { useDialogStore } from '../../stores/dialog';
import { DialogState, type DialogModel } from '../../models'

// 全局数据：
const store = useDialogStore()

const dialogModels: ShallowReactive<DialogModel[]> = store.dialogModels as any

// 数据：
let isShow = computed(() => dialogModels.length > 0)

// 方法：
function Close(id: string, state: DialogState) {
    let model = dialogModels.find(m => m.id === id)
    if (model == undefined) {
        console.warn('The models is undefined!');
        return
    }

    if (model.callback) {
        model.callback(state, model.data)
    }

    const index = dialogModels.indexOf(model);
    dialogModels.splice(index, 1);
}
</script>

<style lang="less" scoped>
.dialog-mask {
    /* 位置 */
    position: relative;
    /* 显示 */
    display: flex;
    /* 对齐 */
    align-items: center;
    justify-content: center;
    /* 尺寸 */
    width: 100vw;
    height: 100vh;
    /* 颜色 */
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(1px);
    /* 置顶 */
    z-index: 999;

    .popPanel {
        /* 显示 */
        display: grid;
        grid-template-rows: auto 1fr auto;
        overflow: hidden;
        /* 位置 */
        position: absolute;
        /* 尺寸 */
        min-width: 200px;
        min-height: 100px;
        max-width: 100%;
        max-height: 100%;
        border-radius: 5px;
        /* 边框 */
        border: 1px solid;
        box-shadow: var(--box-shadow);
        border-color: var(--theme-brand);
        /* 颜色 */
        background: var(--theme-panel-background);

        .titlePanel {
            /* 行 */
            grid-row: 1;
            /* 显示 */
            display: grid;
            grid-template-columns: 1fr auto;
            /* 尺寸 */
            padding: 10px 20px;

            .title {
                /* 列 */
                grid-column: 1;
                /* 对齐 */
                align-self: center;
                justify-self: center;
                /* 字体 */
                font-weight: bold;
                /* 颜色 */
                color: var(--theme-dialog-title-color);
            }

            .btnClose {
                /* 列 */
                grid-column: 2;

                &:hover {
                    color: var(--color-basic-black);
                }
            }
        }

        .content {
            /* 行 */
            grid-row: 2;
            /* 尺寸 */
            padding: 20px;
            overflow: auto;
            max-width: calc(100vw - 20vh);
            max-height: calc(80vh - 50px);
            /* 对齐 */
            align-self: center;
            justify-self: center;
            /* 字体 */
            white-space: pre;
            user-select: text;
            caret-color: transparent;
        }

        .button-panel {
            /* 行 */
            grid-row: 3;
            margin: 5px;

            .yes {
                margin-right: 5px;
            }
        }
    }
}
</style>