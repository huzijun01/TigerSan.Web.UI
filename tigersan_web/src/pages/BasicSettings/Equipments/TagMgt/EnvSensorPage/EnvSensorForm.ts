import { ref } from 'vue'
import { Colors, DialogHelper, Verify, DialogMode, DialogState, FormModel, SubmitResult, FormConfig, FormItemConfig, loading, Texts } from '@/0_tigersan_ui/tigerui'
import { EnvSensorModel, envSensorTable } from './EnvSensorTable'

/** “MAC地址”项目配置 */
const configMacAddr: FormItemConfig<EnvSensorModel, string> = {
    _propName: 'macAddr',
    PropTextEN: 'MacAddr',
    PropTextCH: 'MAC地址',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.macAddr)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new EnvSensorModel()
}

/** “环境传感器”表单配置 */
let configenvSensorForm: FormConfig<EnvSensorModel> = {
    CancelText: Texts.Cancel.value,
    SubmitText: Texts.Ok.value,
    _getSource: AddGetSource,
    _itemConfigs: [
        configMacAddr,
    ]
}

/** “环境传感器”表单模型 */
const envSensorForm = new FormModel(configenvSensorForm)

/** 查 */
function Refresh() {
    try {
        loading.IsShow.value = true

        envSensorTable.Refresh()
    } finally {
        loading.IsShow.value = false
    }
}

/** 增 */
function Add() {
    envSensorForm.Title.value = '导入设备'

    envSensorForm._getSource = AddGetSource

    envSensorForm._onSubmit = source => {
        envSensorTable.RowDatas.push(source)
        return new SubmitResult('添加成功')
    }

    envSensorForm.Show()
}

/** 删 */
function Delete() {
    DialogHelper.ShowDialog(
        '确认',
        '是否确定删除？',
        undefined,
        DeleteRowData,
        DialogMode.YesOrNo,
        Colors.Warning)
}

function DeleteRowData(state: DialogState) {
    if (state != DialogState.Yes) return

    const rowData = envSensorTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return
    }

    envSensorTable.DeleteRowData(rowData)

    DialogHelper.ShowSuccess('删除成功')
}

export default {
    configMacAddr,
    envSensorForm,
    Refresh,
    Add,
    Delete,
}