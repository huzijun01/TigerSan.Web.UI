<template>
    <Form :model="model">
        <FormRow>
            <FormItem :model="nameItemModel">
                <input type="text" v-on:input="OnNameInput">
            </FormItem>
        </FormRow>
        <FormRow>
            <FormItem :model="macAddrItemModel">
                <input type="text" v-on:input="OnMacAddrInput">
            </FormItem>
        </FormRow>
    </Form>
</template>

<script lang="ts" setup>
import { FormModel, FormItemModel, VerifyStates, VerifyResult } from '@/0_tigersan_ui/models';
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

let objGateway = new GatewayModel()

// 【过程】:
model._source = objGateway
model.Title.value = '新增网关'
model.CancelText.value = '取消'
model.SubmitText.value = '确定'

// 【网关名称】:
const nameItemModel = new FormItemModel(model)
nameItemModel.PropName.value = '网关名称'
nameItemModel.IsEquired.value = true
nameItemModel._isVerifyOk = (source) => {
    var res = new VerifyResult()

    var gateway = source as GatewayModel
    if (gateway.Name.trim() === '') {
        res.VerifyText = '请输入名称'
        res.VerifyState = VerifyStates.Error
    }

    return res
}
nameItemModel._setValue = (source, value) => {
    var gateway = source as GatewayModel
    gateway.Name = value as string
}

// 【MAC地址】:
const macAddrItemModel = new FormItemModel(model)
macAddrItemModel.PropName.value = 'MAC地址'
macAddrItemModel.IsEquired.value = true
macAddrItemModel._isVerifyOk = (source) => {
    var res = new VerifyResult()

    var gateway = source as GatewayModel
    if (gateway.MacAddr.trim() === '') {
        res.VerifyText = '请输入MAC地址'
        res.VerifyState = VerifyStates.Error
    }

    return res
}
macAddrItemModel._setValue = (source, value) => {
    var gateway = source as GatewayModel
    gateway.MacAddr = value as string
}

model._itemModels.push(nameItemModel)
model._itemModels.push(macAddrItemModel)

// 【方法】:
function OnNameInput(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    nameItemModel.SetSource(input.value)
}

function OnMacAddrInput(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    macAddrItemModel.SetSource(input.value)
}
</script>

<style lang="less" scoped></style>