<template>
    <Pop :isShow="model.IsShow.value">
        <div class="form-panel">
            <div class="title-panel flex-between">
                <span class="title">{{ model.Title.value }}</span>
                <span class="close iconfont" @click="model.Close">{{ Icons.Close }}</span>
            </div>
            <div class="content-panel">
                <table>
                    <tbody>
                        <slot></slot>
                    </tbody>
                </table>
            </div>
            <div class="button-panel flex-right">
                <button class="cancel" @click="model.Close">{{ model.CancelText.value }}</button>
                <button class="submit bg-success" @click="model.OnSubmit">{{ model.SubmitText.value }}</button>
            </div>
        </div>
    </Pop>
</template>

<script lang="ts" setup>
import Pop from '../Dialog/Pop.vue'
import { FormConfig, FormModel } from '../../models';
import { DefaultObjectAction, Icons } from '../../base'

// 字段:
let { model } = defineProps({
    model: {
        type: FormModel,
        default: new FormModel(new FormConfig(DefaultObjectAction))
    }
})

// 过程:

// 方法:
</script>

<style lang="less" scoped>
@margin-bottom: 25px;
@margin-right: 20px;

table {
    border-collapse: separate;
    border-spacing: @margin-right @margin-bottom;
    margin: -@margin-bottom -@margin-right;
}

.form-panel {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    background-color: var(--theme-background-card);

    .title-panel {
        padding: 16px 27px 16px 24px;
        border-bottom: 1px solid var(--theme-border-divider);

        .title {
            font-weight: bold;
        }

        .close {
            cursor: pointer;
        }
    }

    .content-panel {
        flex-grow: 1;
        padding: 24px;
    }

    .button-panel {
        padding: 10px 16px 10px 20px;
        border-top: 1px solid var(--theme-border-divider);

        .submit {
            margin-left: 10px;
        }
    }
}
</style>