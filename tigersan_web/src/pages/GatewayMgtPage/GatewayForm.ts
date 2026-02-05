import { ref, type InputHTMLAttributes } from 'vue'
import { Colors } from '@/0_tigersan_ui/base'
import { dialog } from '@/0_tigersan_ui/stores'
import { ObjectShallowCopy } from '@/0_tigersan_ui/helpers'
import { GatewayModel, gatewayTable } from './GatewayTable'
import { DialogMode, DialogState, FormModel, SubmitResult, FormResult, VerifyResult, FormConfig, FormItemConfig } from '@/0_tigersan_ui/models'

/** “网关名称”项目配置 */
const configName: FormItemConfig = {
    PropName: '网关名称',
    IsEquired: true,
    Target: ref<unknown>(),
    _getValue: source => {
        var gateway = source as GatewayModel
        return gateway.Name
    },
    _setValue: (source, value) => {
        var gateway = source as GatewayModel
        gateway.Name = value as string
    },
    _isVerifyOk: (source) => {
        var res = new VerifyResult()

        var gateway = source as GatewayModel
        if (gateway.Name.trim() === '') {
            res.VerifyText = '请输入名称'
            res.VerifyState = FormResult.Error
        }

        return res
    }
}

/** “MAC地址”项目配置 */
const configMacAddr: FormItemConfig = {
    PropName: 'MAC地址',
    IsEquired: true,
    Target: ref<unknown>(),
    _getValue: source => {
        var gateway = source as GatewayModel
        return gateway.MacAddr
    },
    _setValue: (source, value) => {
        var gateway = source as GatewayModel
        gateway.MacAddr = value as string
    },
    _isVerifyOk: (source) => {
        var res = new VerifyResult()

        var gateway = source as GatewayModel
        if (gateway.MacAddr.trim() === '') {
            res.VerifyText = '请输入MAC地址'
            res.VerifyState = FormResult.Error
        }

        return res
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new GatewayModel()
}

/** “网关”表单配置 */
let configGatewayForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configName,
        configMacAddr,
    ]
}

/** “网关”表单模型 */
const gatewayForm = new FormModel(configGatewayForm)

// 【方法】:
function SetName(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    if (configName.SetSource) {
        configName.SetSource(input.value)
    }
}

function SetMacAddr(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    if (configMacAddr.SetSource) {
        configMacAddr.SetSource(input.value)
    }
}

/** 查 */
function Refresh() {
    gatewayTable.Refresh()
}

/** 增 */
function Add() {
    gatewayForm.Title.value = '新增网关'

    gatewayForm._getSource = AddGetSource

    gatewayForm._onSubmit = source => {
        gatewayTable.RowDatas.push(source)
        gatewayTable.Refresh()

        return new SubmitResult('添加成功')
    }

    gatewayForm.Show()
}

/** 改 */
function Edit() {
    gatewayForm.Title.value = '修改网关'

    let iRow = 0

    gatewayForm._getSource = () => {
        const rowData = gatewayTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.log('The rowData is undefined!')
            return {}
        }

        iRow = gatewayTable.RowDatas.indexOf(rowData)
        return ObjectShallowCopy(rowData)
    }

    gatewayForm._onSubmit = source => {
        gatewayTable.RowDatas[iRow] = source
        gatewayTable.Refresh()

        return new SubmitResult('修改成功')
    }

    gatewayForm.Show()
}

/** 删 */
function Delete() {
    dialog.ShowDialog(
        '确认',
        '是否确定删除？',
        DeleteRowData,
        DialogMode.YesOrNo,
        Colors.Warning)
}

function DeleteRowData(state: DialogState) {
    if (state != DialogState.Yes) return

    const rowData = gatewayTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.log('The rowData is undefined!')
        return {}
    }

    gatewayTable.RowDatas = gatewayTable.RowDatas.filter(r => r != rowData)
    gatewayTable.Refresh()

    dialog.ShowSuccess('删除成功')
}

export {
    configName,
    configMacAddr,
    gatewayForm,
    SetName,
    SetMacAddr,
    Refresh,
    Add,
    Edit,
    Delete,
}