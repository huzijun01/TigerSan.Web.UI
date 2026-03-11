import { ref } from 'vue'
import { Terminal4gModel, terminal4gTable } from './Terminal4gTable'
import {
    Colors, dialog, Verify, ObjectHelper,
    DialogMode, DialogState, FormModel, SubmitResult, FormConfig, FormItemConfig
} from '@/0_tigersan_ui/tigerui'

/** “IMEI”项目配置 */
const configIMEI: FormItemConfig = {
    _propName: 'IMEI',
    PropText: 'IMEI',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var terminal4g = source as Terminal4gModel
        return Verify.IsNotUndefinedOrEmpty(terminal4g.IMEI)
    }
}

/** “设备名称”项目配置 */
const configEqpName: FormItemConfig = {
    _propName: 'EqpName',
    PropText: '设备名称',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var terminal4g = source as Terminal4gModel
        return Verify.IsNotUndefinedOrEmpty(terminal4g.EqpName)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new Terminal4gModel()
}

/** “4G标签”表单配置 */
let configTerminal4gForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configEqpName,
        configIMEI,
    ]
}

/** “4G标签”表单模型 */
const terminal4gForm = new FormModel(configTerminal4gForm)

/** 查 */
function Refresh() {
    terminal4gTable.Refresh()
}

/** 增 */
function Add() {
    terminal4gForm.Title.value = '新增标签'

    terminal4gForm._getSource = AddGetSource

    terminal4gForm._onSubmit = source => {
        terminal4gTable.RowDatas.push(source)
        return new SubmitResult('添加成功')
    }

    terminal4gForm.Show()
}

/** 改 */
function Edit() {
    terminal4gForm.Title.value = '修改标签'

    let iRow = 0

    terminal4gForm._getSource = () => {
        const rowData = terminal4gTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return {}
        }

        iRow = terminal4gTable.RowDatas.indexOf(rowData)
        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    terminal4gForm._onSubmit = source => {
        terminal4gTable.RowDatas[iRow] = source
        terminal4gTable.Refresh()

        return new SubmitResult('修改成功')
    }

    terminal4gForm.Show()
}

/** 删 */
function Delete() {
    dialog.ShowDialog(
        '确认',
        '是否确定删除？',
        undefined,
        DeleteRowData,
        DialogMode.YesOrNo,
        Colors.Warning)
}

function DeleteRowData(state: DialogState) {
    if (state != DialogState.Yes) return

    const rowData = terminal4gTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    terminal4gTable.DeleteRowData(rowData)

    dialog.ShowSuccess('删除成功')
}

export default {
    configEqpName,
    configIMEI,
    terminal4gForm,
    Refresh,
    Add,
    Edit,
    Delete,
}