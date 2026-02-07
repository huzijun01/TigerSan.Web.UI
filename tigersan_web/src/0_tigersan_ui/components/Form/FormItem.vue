<template>
    <td class="prop-name" :class="{ 'equired': model.IsEquired.value }">
        <span class="prop-text">{{ model.PropText.value }}</span>
    </td>
    <td class="prop-value">
        <slot></slot>
        <span class="verify-text" v-if="model.IsShowVerify.value" :style="model.verifyStyleObj.value">{{
            model.VerifyText.value }}</span>
    </td>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormConfig } from '../../models'
import { DefaultObjectAction } from '../../helpers'
import { FormModel, FormItemModel } from '../../models/Form/FormModel'

let { model } = defineProps({
    model: {
        type: FormItemModel,
        default: () => new FormItemModel(new FormModel(new FormConfig(DefaultObjectAction)), '', ref())
    }
})
</script>

<style lang="less" scoped>
.prop-name {
    margin-right: 10px;
    text-wrap: nowrap;

    .prop-text {
        user-select: text;
    }

    &.equired::before {
        margin-right: 4px;
        color: red;
        content: '*';
    }
}

.prop-value {
    position: relative;
    text-wrap: nowrap;

    .verify-text {
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translate(0, 15px);
        font-size: 12px;
    }
}
</style>