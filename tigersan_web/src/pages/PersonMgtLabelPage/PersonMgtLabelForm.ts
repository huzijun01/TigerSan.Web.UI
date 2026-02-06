import { ref, type InputHTMLAttributes } from 'vue'
import { Colors } from '@/0_tigersan_ui/base'
import { dialog } from '@/0_tigersan_ui/stores'
import { IsNotUndefinedOrEmpty, ObjectShallowCopy } from '@/0_tigersan_ui/helpers'
import { PersonMgtLabelModel, personMgtLabelTable } from './PersonMgtLabelTable'
import { DialogMode, DialogState, FormModel, SubmitResult, FormResult, VerifyResult, FormConfig, FormItemConfig } from '@/0_tigersan_ui/models'

/** “IMEI”项目配置 */
const configIMEI: FormItemConfig = {
    _propName: 'IMEI',
    PropText: 'IMEI',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var personMgtLabel = source as PersonMgtLabelModel
        return IsNotUndefinedOrEmpty(personMgtLabel.IMEI)
    }
}

/** “网关名称”项目配置 */
const configEqpName: FormItemConfig = {
    _propName: 'EqpName',
    PropText: '网关名称',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var personMgtLabel = source as PersonMgtLabelModel
        return IsNotUndefinedOrEmpty(personMgtLabel.EqpName)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new PersonMgtLabelModel()
}

/** “网关”表单配置 */
let configPersonMgtLabelForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configEqpName,
        configIMEI,
    ]
}

/** “网关”表单模型 */
const PersonMgtLabelForm = new FormModel(configPersonMgtLabelForm)

// 【方法】:
function SetEqpName(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    if (configEqpName.SetSource) {
        configEqpName.SetSource(input.value)
    }
}

function SetIMEI(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    if (configIMEI.SetSource) {
        configIMEI.SetSource(input.value)
    }
}

/** 查 */
function Refresh() {
    personMgtLabelTable.Refresh()
}

/** 增 */
function Add() {
    PersonMgtLabelForm.Title.value = '新增网关'

    PersonMgtLabelForm._getSource = AddGetSource

    PersonMgtLabelForm._onSubmit = source => {
        personMgtLabelTable.RowDatas.push(source)
        personMgtLabelTable.Refresh()

        return new SubmitResult('添加成功')
    }

    PersonMgtLabelForm.Show()
}

/** 改 */
function Edit() {
    PersonMgtLabelForm.Title.value = '修改网关'

    let iRow = 0

    PersonMgtLabelForm._getSource = () => {
        const rowData = personMgtLabelTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return {}
        }

        iRow = personMgtLabelTable.RowDatas.indexOf(rowData)
        return ObjectShallowCopy(rowData)
    }

    PersonMgtLabelForm._onSubmit = source => {
        personMgtLabelTable.RowDatas[iRow] = source
        personMgtLabelTable.Refresh()

        return new SubmitResult('修改成功')
    }

    PersonMgtLabelForm.Show()
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

    const rowData = personMgtLabelTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    personMgtLabelTable.RowDatas = personMgtLabelTable.RowDatas.filter(r => r != rowData)
    personMgtLabelTable.Refresh()

    dialog.ShowSuccess('删除成功')
}

export {
    configEqpName,
    configIMEI,
    PersonMgtLabelForm,
    SetEqpName,
    SetIMEI,
    Refresh,
    Add,
    Edit,
    Delete,
}