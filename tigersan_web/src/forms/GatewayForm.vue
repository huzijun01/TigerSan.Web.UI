<template>
    <Form :model="model">
        <FormRow>
            <FormItem :model="nameModel">
                <input type="text" :value="nameModel.Target.value" v-on:input="OnNameInput">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="macAddrModel">
                <input type="text" :value="macAddrModel.Target.value" v-on:input="OnMacAddrInput">
            </FormItem>
        </FormRow>
    </Form>
</template>

<script lang="ts" setup>
import { FormModel, FormItemModel, FormResult, VerifyResult } from '@/0_tigersan_ui/models';
import { Form, FormRow, FormItem } from '@/0_tigersan_ui/components'
import { GatewayModel } from '@/testTableModel'
import type { InputHTMLAttributes } from 'vue';

// 【字段】:
let { model } = defineProps({
    model: {
        type: FormModel,
        default: new FormModel()
    }
})


// 【过程】:
// 网关名称:
const nameModel = new FormItemModel(
    model,
    source => {
        var gateway = source as GatewayModel
        return gateway.Name
    },
    (source, value) => {
        var gateway = source as GatewayModel
        gateway.Name = value as string
    }
)

nameModel.PropName.value = '网关名称'
nameModel.IsEquired.value = true
nameModel._isVerifyOk = (source) => {
    var res = new VerifyResult()

    var gateway = source as GatewayModel
    if (gateway.Name.trim() === '') {
        res.VerifyText = '请输入名称'
        res.VerifyState = FormResult.Error
    }

    return res
}

model._itemModels.push(nameModel)

// MAC地址:
const macAddrModel = new FormItemModel(
    model,
    source => {
        var gateway = source as GatewayModel
        return gateway.MacAddr
    },
    (source, value) => {
        var gateway = source as GatewayModel
        gateway.MacAddr = value as string
    })

macAddrModel.PropName.value = 'MAC地址'
macAddrModel.IsEquired.value = true
macAddrModel._isVerifyOk = (source) => {
    var res = new VerifyResult()

    var gateway = source as GatewayModel
    if (gateway.MacAddr.trim() === '') {
        res.VerifyText = '请输入MAC地址'
        res.VerifyState = FormResult.Error
    }

    return res
}

model._itemModels.push(macAddrModel)

// 【方法】:
function OnNameInput(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    nameModel.SetSource(input.value)
}

function OnMacAddrInput(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    macAddrModel.SetSource(input.value)
}
</script>

<style lang="less" scoped></style>