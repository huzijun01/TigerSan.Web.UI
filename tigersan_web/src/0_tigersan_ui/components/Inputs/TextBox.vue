<template>
    <div class="textbox flex-right">
        <input type="text" v-model="model.Value.value" :placeholder="model.Placeholder.value"
            :readonly="model.IsReadonly.value" :style="model.styleObj.value" @input="model.OnInput"
            @change="model.OnChange">
        <div class="button iconfont" @click="model.OnClear">{{ Icons.Close }}</div>
    </div>
</template>

<script lang="ts" setup>
import { Icons } from '../../base'
import { TextBoxModel } from '../../models'

let { model } = defineProps({
    model: {
        type: TextBoxModel,
        default: () => new TextBoxModel()
    }
})
</script>

<style lang="less" scoped>
@size: 16px;

.textbox {
    position: relative;

    input {
        padding-right: 35px;
    }

    .button {
        position: absolute;
        width: @size;
        height: @size;
        font-size: @size;
        line-height: 1;
        cursor: pointer;
        margin-right: 10px;
        color: var(--color-placeholder-text);
    }
}
</style>