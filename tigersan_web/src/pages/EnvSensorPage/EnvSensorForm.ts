import { ref, type InputHTMLAttributes } from 'vue'
import { Colors } from '@/0_tigersan_ui/base'
import { dialog } from '@/0_tigersan_ui/stores'
import { EnvSensorModel, envSensorTable } from './EnvSensorTable'
import { DialogMode, DialogState, FormModel, SubmitResult, FormResult, VerifyResult, FormConfig, FormItemConfig } from '@/0_tigersan_ui/models'

/** “MAC地址”项目配置 */
const configMacAddr: FormItemConfig = {
    _propName: 'MacAddr',
    PropText: 'MAC地址',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var res = new VerifyResult()

        var EnvSensor = source as EnvSensorModel
        if (EnvSensor.MacAddr.trim() === '') {
            res.VerifyText = '请输入MAC地址'
            res.VerifyState = FormResult.Error
        }

        return res
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new EnvSensorModel()
}

/** “环境传感器”表单配置 */
let configEnvSensorForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configMacAddr,
    ]
}

/** “环境传感器”表单模型 */
const EnvSensorForm = new FormModel(configEnvSensorForm)

// 【方法】:
function SetMacAddr(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    if (configMacAddr.SetSource) {
        configMacAddr.SetSource(input.value)
    }
}

/** 查 */
function Refresh() {
    envSensorTable.Refresh()
}

/** 增 */
function Add() {
    EnvSensorForm.Title.value = '导入设备'

    EnvSensorForm._getSource = AddGetSource

    EnvSensorForm._onSubmit = source => {
        envSensorTable.RowDatas.push(source)
        envSensorTable.Refresh()

        return new SubmitResult('添加成功')
    }

    EnvSensorForm.Show()
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

    const rowData = envSensorTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.log('The rowData is undefined!')
        return {}
    }

    envSensorTable.RowDatas = envSensorTable.RowDatas.filter(r => r != rowData)
    envSensorTable.Refresh()

    dialog.ShowSuccess('删除成功')
}

export {
    configMacAddr,
    EnvSensorForm,
    SetMacAddr,
    Refresh,
    Add,
    Delete,
}