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
import { Icons } from '../../base'
import { ObjectHelper } from '../../helpers'
import { FormConfig, FormModel } from '../../models'

// 字段:
const { model } = defineProps({
    model: {
        type: FormModel<any>,
        default: () => new FormModel(new FormConfig(ObjectHelper.DefaultObjectAction))
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
    position: relative;
    display: flex;
    flex-direction: column;
    max-width: 95vw;
    max-height: 95vh;
    border-radius: 10px;
    background-color: var(--theme-card-background);

    .title-panel {
        padding: 16px 27px 16px 24px;
        border-bottom: 1px solid var(--theme-border-divider);

        .title {
            margin-right: 16px;
            font-weight: bold;
        }

        .close {
            cursor: pointer;
        }
    }

    .content-panel {
        flex-grow: 1;
        padding: 24px;
        overflow: auto;
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