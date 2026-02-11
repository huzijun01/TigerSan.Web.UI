<template>
    <div class="password flex-right">
        <input :type="model.Type.value" v-model="model.Value.value" :placeholder="model.Placeholder.value"
            :readonly="model.IsReadonly.value" :style="model.styleObj.value" @input="model.OnInput"
            @change="model.OnChange">
        <div class="button-panel flex-center">
            <div class="button iconfont" @click="model.OnClickEye">{{ model.EyeText.value }}</div>
            <div class="button iconfont" @click="model.OnClear">{{ Icons.Close }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Icons } from '../../base'
import { PasswordModel } from '../../models'

let { model } = defineProps({
    model: {
        type: PasswordModel,
        default: new PasswordModel()
    }
})
</script>

<style lang="less" scoped>
@size: 16px;

.password {
    position: relative;

    input {
        padding-right: 65px;
    }

    .button-panel {
        position: absolute;

        .button {
            width: @size;
            height: @size;
            font-size: @size;
            line-height: 1;
            cursor: pointer;
            margin-right: 10px;
            color: var(--color-placeholder-text);
        }
    }
}
</style>