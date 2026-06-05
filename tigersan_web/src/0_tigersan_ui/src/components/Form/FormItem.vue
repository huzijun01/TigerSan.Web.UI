<template>
    <td class="prop-name" v-if="model.IsShowPropName.value" :class="{ 'equired': model.IsEquired.value }"
        :style="model.propNameStyle.value">
        <span class="prop-text">{{ model.PropText.value }}</span>
    </td>
    <td class="prop-value">
        <slot></slot>
        <span class="verify-text" v-if="model.IsShowVerify.value" :style="model.verifyStyle.value">{{
            model.VerifyText.value }}</span>
    </td>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormConfig } from '../../models'
import { ObjectHelper } from '../../helpers'
import { FormModel, FormItemModel } from '../../models/Form/FormModel'

const { model } = defineProps({
    model: {
        type: FormItemModel<any, any>,
        default: () => new FormItemModel(new FormModel(new FormConfig(ObjectHelper.DefaultObjectAction)), '', ref())
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