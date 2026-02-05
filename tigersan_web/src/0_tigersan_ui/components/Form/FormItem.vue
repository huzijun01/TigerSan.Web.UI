<template>
    <td class="prop-name" :class="{ 'equired': model.IsEquired.value }">
        <span>{{ model.PropName.value }}</span>
    </td>
    <td class="prop-value">
        <slot></slot>
        <span class="verify-text" v-if="model.IsShowVerify.value" :style="model.verifyStyleObj.value">{{
            model.VerifyText.value }}</span>
    </td>
</template>

<script lang="ts" setup>
import { FormModel, FormItemModel } from '../../models/Form/FormModel';

let { model } = defineProps({
    model: {
        type: FormItemModel,
        default: new FormItemModel(new FormModel(), () => { }, () => { })
    }
})
</script>

<style lang="less" scoped>
.prop-name {
    margin-right: 10px;
    text-wrap: nowrap;

    &.equired::before {
        margin-right: 4px;
        color: red;
        content: '*';
    }
}

.prop-value {
    position: relative;

    .verify-text {
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translate(0, 15px);
        font-size: 12px;
    }
}
</style>