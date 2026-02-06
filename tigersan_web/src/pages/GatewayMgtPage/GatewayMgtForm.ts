import { ref, type InputHTMLAttributes } from 'vue'
import { Colors } from '@/0_tigersan_ui/base'
import { dialog } from '@/0_tigersan_ui/stores'
import { IsNotUndefinedOrEmpty, ObjectShallowCopy } from '@/0_tigersan_ui/helpers'
import { GatewayMgtModel, gatewayMgtTable } from './GatewayMgtTable'
import { DialogMode, DialogState, FormModel, SubmitResult, FormResult, VerifyResult, FormConfig, FormItemConfig } from '@/0_tigersan_ui/models'

/** “网关名称”项目配置 */
const configName: FormItemConfig = {
    _propName: 'Name',
    PropText: '网关名称',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var gateway = source as GatewayMgtModel
        return IsNotUndefinedOrEmpty(gateway.Name)
    }
}

/** “MAC地址”项目配置 */
const configMacAddr: FormItemConfig = {
    _propName: 'MacAddr',
    PropText: 'MAC地址',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var gateway = source as GatewayMgtModel
        return IsNotUndefinedOrEmpty(gateway.MacAddr)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new GatewayMgtModel()
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

/** 查 */
function Refresh() {
    gatewayMgtTable.Refresh()
}

/** 增 */
function Add() {
    gatewayForm.Title.value = '新增网关'

    gatewayForm._getSource = AddGetSource

    gatewayForm._onSubmit = source => {
        gatewayMgtTable.RowDatas.push(source)
        gatewayMgtTable.Refresh()

        return new SubmitResult('添加成功')
    }

    gatewayForm.Show()
}

/** 改 */
function Edit() {
    gatewayForm.Title.value = '修改网关'

    let iRow = 0

    gatewayForm._getSource = () => {
        const rowData = gatewayMgtTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return {}
        }

        iRow = gatewayMgtTable.RowDatas.indexOf(rowData)
        return ObjectShallowCopy(rowData)
    }

    gatewayForm._onSubmit = source => {
        gatewayMgtTable.RowDatas[iRow] = source
        gatewayMgtTable.Refresh()

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

    const rowData = gatewayMgtTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    gatewayMgtTable.RowDatas = gatewayMgtTable.RowDatas.filter(r => r != rowData)
    gatewayMgtTable.Refresh()

    dialog.ShowSuccess('删除成功')
}

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

export {
    configName,
    configMacAddr,
    gatewayForm,
    Refresh,
    Add,
    Edit,
    Delete,
    SetName,
    SetMacAddr,
}