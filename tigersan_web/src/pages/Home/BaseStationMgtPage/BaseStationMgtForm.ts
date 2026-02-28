import { ref } from 'vue'
import { BaseStationMgtModel, baseStationMgtTable } from './BaseStationMgtTable'
import {
    Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, SubmitResult, FormConfig, FormItemConfig
} from '@/0_tigersan_ui/tigerui'

/** “设备名称”项目配置 */
const configName: FormItemConfig = {
    _propName: 'Name',
    PropText: '设备名称',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var baseStation = source as BaseStationMgtModel
        return Verify.IsNotUndefinedOrEmpty(baseStation.Name)
    }
}

/** “MAC地址”项目配置 */
const configMacAddr: FormItemConfig = {
    _propName: 'MacAddr',
    PropText: 'MAC地址',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var baseStation = source as BaseStationMgtModel
        return Verify.IsNotUndefinedOrEmpty(baseStation.MacAddr)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new BaseStationMgtModel()
}

/** “基站管理”表单配置 */
let configBaseStationForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configName,
        configMacAddr,
    ]
}

/** “基站管理”表单模型 */
const baseStationForm = new FormModel(configBaseStationForm)

/** 查 */
function Refresh() {
    baseStationMgtTable.Refresh()
}

/** 增 */
function Add() {
    baseStationForm.Title.value = '新增基站'

    baseStationForm._getSource = AddGetSource

    baseStationForm._onSubmit = source => {
        baseStationMgtTable.RowDatas.push(source)
        return new SubmitResult('添加成功')
    }

    baseStationForm.Show()
}

/** 改 */
function Edit() {
    baseStationForm.Title.value = '修改基站'

    let iRow = 0

    baseStationForm._getSource = () => {
        const rowData = baseStationMgtTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return {}
        }

        iRow = baseStationMgtTable.RowDatas.indexOf(rowData)
        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    baseStationForm._onSubmit = source => {
        baseStationMgtTable.RowDatas[iRow] = source
        baseStationMgtTable.Refresh()

        return new SubmitResult('修改成功')
    }

    baseStationForm.Show()
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

    const rowData = baseStationMgtTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    baseStationMgtTable.DeleteRowData(rowData)

    dialog.ShowSuccess('删除成功')
}

export default {
    configName,
    configMacAddr,
    baseStationForm,
    Refresh,
    Add,
    Edit,
    Delete,
}