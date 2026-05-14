<template>
    <Teleport to="body">
        <div class="dialog-mask pop-mask" v-if="isShow">
            <div class="pop-panel" v-for="m in dialogModels" :key="m.id" :style="{ borderColor: m.Color.value }">
                <div class="titlePanel" :style="{ background: m.Color.value }">
                    <div class="title">{{ m.Title }}</div>
                    <button class="btnClose btn_clear iconfont" @click="Close(m.id, DialogState.Cancel)">
                        {{ Icons.Close }}
                    </button>
                </div>
                <div class="content">{{ m.Msg }}</div>
                <div class="button-panel flex-stretch" v-if="m.IsShowButtonPanel.value">
                    <button class="yes bg-success" @click="Close(m.id, DialogState.Yes)">
                        {{ m.ShowYesText.value }}
                    </button>
                    <button class="no bg-danger" v-if="m.IsShowNoButton.value" @click="Close(m.id, DialogState.No)">
                        {{ m.ShowNoText.value }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import { Icons } from '../../base'
import { useDialogStore } from '../../stores/dialog'
import { DialogState, DialogModel } from '../../models'
import { Teleport, computed, type ShallowReactive } from 'vue'

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
        model.callback(state, model._data)
    }

    const index = dialogModels.indexOf(model);
    dialogModels.splice(index, 1);
}
</script>

<style lang="less" scoped>
.dialog-mask {
    z-index: 99999;

    .pop-panel {
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