import { ref } from 'vue'
import { PersonMgtTagModel, personMgtTagTable } from './PersonMgtTagTable'
import {
    Colors, dialog, Verify, ObjectHelper,
    DialogMode, DialogState, FormModel, SubmitResult, FormConfig, FormItemConfig
} from '@/0_tigersan_ui/tigerui'

/** “IMEI”项目配置 */
const configIMEI: FormItemConfig<PersonMgtTagModel> = {
    _propName: 'IMEI',
    PropText: 'IMEI',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.IMEI)
    }
}

/** “设备名称”项目配置 */
const configEqpName: FormItemConfig<PersonMgtTagModel> = {
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
    return new PersonMgtTagModel()
}

/** “人员管理标签”表单配置 */
let configPersonMgtTagForm: FormConfig<PersonMgtTagModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configEqpName,
        configIMEI,
    ]
}

/** “人员管理标签”表单模型 */
const personMgtTagForm = new FormModel<PersonMgtTagModel>(configPersonMgtTagForm)

/** 查 */
function Refresh() {
    personMgtTagTable.Refresh()
}

/** 增 */
function Add() {
    personMgtTagForm.Title.value = '新增标签'

    personMgtTagForm._getSource = AddGetSource

    personMgtTagForm._onSubmit = source => {
        personMgtTagTable.RowDatas.push(source)
        personMgtTagTable.Refresh()

        return new SubmitResult('添加成功')
    }

    personMgtTagForm.Show()
}

/** 改 */
function Edit() {
    personMgtTagForm.Title.value = '修改标签'

    let iRow = 0

    personMgtTagForm._getSource = () => {
        const rowData = personMgtTagTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new PersonMgtTagModel()
        }

        iRow = personMgtTagTable.RowDatas.indexOf(rowData)
        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    personMgtTagForm._onSubmit = source => {
        personMgtTagTable.RowDatas[iRow] = source
        return new SubmitResult('修改成功')
    }

    personMgtTagForm.Show()
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

    const rowData = personMgtTagTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    personMgtTagTable.DeleteRowData(rowData)

    dialog.ShowSuccess('删除成功')
}

export default {
    configEqpName,
    configIMEI,
    personMgtTagForm,
    Refresh,
    Add,
    Edit,
    Delete,
}