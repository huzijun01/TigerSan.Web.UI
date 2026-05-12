import { ref } from 'vue'
import { Terminal4gModel, terminal4gTable } from './Terminal4gTable'
import {
    Colors, dialog, Verify, ObjectHelper,
    DialogMode, DialogState, FormModel, SubmitResult, FormConfig, FormItemConfig,
    loading
} from '@/0_tigersan_ui/tigerui'

/** “IMEI”项目配置 */
const configIMEI: FormItemConfig<Terminal4gModel, string> = {
    _propName: 'IMEI',
    PropText: 'IMEI',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.IMEI)
    }
}

/** “设备名称”项目配置 */
const configEqpName: FormItemConfig<Terminal4gModel, string> = {
    _propName: 'EqpName',
    PropText: '设备名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.EqpName)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new Terminal4gModel()
}

/** “4G标签”表单配置 */
let configTerminal4gForm: FormConfig<Terminal4gModel> = {
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
    try {
        loading.IsShow.value = true

        terminal4gTable.Refresh()
    } finally {
        loading.IsShow.value = false
    }
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
            return new Terminal4gModel()
        }

        iRow = terminal4gTable.RowDatas.indexOf(rowData)
        return ObjectHelper.ShallowCopy(rowData)
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