import { ref } from 'vue'
import { Label4gModel, label4gTable } from './Label4gTable'
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
        var label4g = source as Label4gModel
        return Verify.IsNotUndefinedOrEmpty(label4g.IMEI)
    }
}

/** “设备名称”项目配置 */
const configEqpName: FormItemConfig = {
    _propName: 'EqpName',
    PropText: '设备名称',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var label4g = source as Label4gModel
        return Verify.IsNotUndefinedOrEmpty(label4g.EqpName)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new Label4gModel()
}

/** “4G标签”表单配置 */
let configLabel4gForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configEqpName,
        configIMEI,
    ]
}

/** “4G标签”表单模型 */
const label4gForm = new FormModel(configLabel4gForm)

/** 查 */
function Refresh() {
    label4gTable.Refresh()
}

/** 增 */
function Add() {
    label4gForm.Title.value = '新增标签'

    label4gForm._getSource = AddGetSource

    label4gForm._onSubmit = source => {
        label4gTable.RowDatas.push(source)
        return new SubmitResult('添加成功')
    }

    label4gForm.Show()
}

/** 改 */
function Edit() {
    label4gForm.Title.value = '修改标签'

    let iRow = 0

    label4gForm._getSource = () => {
        const rowData = label4gTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return {}
        }

        iRow = label4gTable.RowDatas.indexOf(rowData)
        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    label4gForm._onSubmit = source => {
        label4gTable.RowDatas[iRow] = source
        label4gTable.Refresh()

        return new SubmitResult('修改成功')
    }

    label4gForm.Show()
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

    const rowData = label4gTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    label4gTable.DeleteRowData(rowData)

    dialog.ShowSuccess('删除成功')
}

export default {
    configEqpName,
    configIMEI,
    label4gForm,
    Refresh,
    Add,
    Edit,
    Delete,
}