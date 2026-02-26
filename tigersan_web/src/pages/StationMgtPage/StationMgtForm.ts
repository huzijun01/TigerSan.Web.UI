import { ref } from 'vue'
import { StationMgtModel, stationMgtTable } from './StationMgtTable'
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
        var station = source as StationMgtModel
        return Verify.IsNotUndefinedOrEmpty(station.Name)
    }
}

/** “MAC地址”项目配置 */
const configMacAddr: FormItemConfig = {
    _propName: 'MacAddr',
    PropText: 'MAC地址',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var station = source as StationMgtModel
        return Verify.IsNotUndefinedOrEmpty(station.MacAddr)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new StationMgtModel()
}

/** “基站管理”表单配置 */
let configStationForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configName,
        configMacAddr,
    ]
}

/** “基站管理”表单模型 */
const stationForm = new FormModel(configStationForm)

/** 查 */
function Refresh() {
    stationMgtTable.Refresh()
}

/** 增 */
function Add() {
    stationForm.Title.value = '新增基站'

    stationForm._getSource = AddGetSource

    stationForm._onSubmit = source => {
        stationMgtTable.RowDatas.push(source)
        return new SubmitResult('添加成功')
    }

    stationForm.Show()
}

/** 改 */
function Edit() {
    stationForm.Title.value = '修改基站'

    let iRow = 0

    stationForm._getSource = () => {
        const rowData = stationMgtTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return {}
        }

        iRow = stationMgtTable.RowDatas.indexOf(rowData)
        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    stationForm._onSubmit = source => {
        stationMgtTable.RowDatas[iRow] = source
        stationMgtTable.Refresh()

        return new SubmitResult('修改成功')
    }

    stationForm.Show()
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

    const rowData = stationMgtTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    stationMgtTable.DeleteRowData(rowData)

    dialog.ShowSuccess('删除成功')
}

export default {
    configName,
    configMacAddr,
    stationForm,
    Refresh,
    Add,
    Edit,
    Delete,
}