<template>
    <Teleport to="body">
        <div class="mask" v-if="isShow">
            <div class="popPanel" v-for="m in dialogModels" :key="m.id" :style="{ borderColor: m.color }">
                <div class="titlePanel" :style="{ background: m.color }">
                    <div class="title">{{ m.title }}</div>
                    <button class="btnClose btn_clear iconfont" @click="Close(m.id)">&#xe639;</button>
                </div>
                <div class="content">{{ m.msg }}</div>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import { Teleport, computed } from 'vue';
import { useDialogStore } from '@/0_tigersan_ui/stores/dialog';

// 全局数据：
let { dialogModels } = useDialogStore()

// 数据：
let isShow = computed(() => dialogModels.length > 0)
// 方法：
function Close(id: string) {
    let model = dialogModels.find(m => m.id === id)
    if (model == undefined) {
        console.log('The models is undefined!');
        return
    }

    const index = dialogModels.indexOf(model);
    dialogModels.splice(index, 1);
}
</script>

<style lang="less" scoped>
.mask {
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

    .popPanel {
        /* 显示 */
        display: grid;
        grid-template-rows: auto 1fr;
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
        border-color: var(--color-brand);
        /* 颜色 */
        background: var(--color-base-fill);

        .titlePanel {
            /* 行 */
            grid-row: 1;
            /* 显示 */
            display: grid;
            grid-template-columns: 1fr auto;
            /* 尺寸 */
            padding: 10px 20px;
            /* 颜色 */
            background: var(--color-brand);

            .title {
                /* 列 */
                grid-column: 1;
                /* 对齐 */
                align-self: center;
                justify-self: center;
                /* 字体 */
                font-weight: bold;
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
    }
}
</style>