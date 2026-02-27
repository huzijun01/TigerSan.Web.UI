import { ref } from 'vue'
import { AssetMgtLabelModel, assetMgtLabelTable } from './AssetMgtLabelTable'
import { Verify, dialog, Colors, DialogMode, DialogState, FormModel, SubmitResult, FormConfig, FormItemConfig } from '@/0_tigersan_ui/tigerui'

/** “MAC地址”项目配置 */
const configMacAddr: FormItemConfig = {
    _propName: 'MacAddr',
    PropText: 'MAC地址',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var assetMgtLabel = source as AssetMgtLabelModel
        return Verify.IsNotUndefinedOrEmpty(assetMgtLabel.MacAddr)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new AssetMgtLabelModel()
}

/** “资产管理标签”表单配置 */
let configassetMgtLabelForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configMacAddr,
    ]
}

/** “资产管理标签”表单模型 */
const assetMgtLabelForm = new FormModel(configassetMgtLabelForm)

/** 查 */
function Refresh() {
    assetMgtLabelTable.Refresh()
}

/** 增 */
function Add() {
    assetMgtLabelForm.Title.value = '导入设备'

    assetMgtLabelForm._getSource = AddGetSource

    assetMgtLabelForm._onSubmit = source => {
        assetMgtLabelTable.RowDatas.push(source)
        return new SubmitResult('添加成功')
    }

    assetMgtLabelForm.Show()
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

    const rowData = assetMgtLabelTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    assetMgtLabelTable.DeleteRowData(rowData)

    dialog.ShowSuccess('删除成功')
}

export default {
    configMacAddr,
    assetMgtLabelForm,
    Refresh,
    Add,
    Delete,
}