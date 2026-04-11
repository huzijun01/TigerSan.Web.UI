import { ref } from 'vue'
import { Verify, dialog, Colors, DialogMode, DialogState, FormModel, SubmitResult, FormConfig, FormItemConfig } from '@/0_tigersan_ui/tigerui'
import { AssetMgtTagModel, assetMgtTagTable } from './AssetMgtTagTable'

/** “MAC地址”项目配置 */
const configMacAddr: FormItemConfig<AssetMgtTagModel, string> = {
    _propName: 'macAddr',
    PropText: 'MAC地址',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.macAddr)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new AssetMgtTagModel()
}

/** “资产管理标签”表单配置 */
let configassetMgtTagForm: FormConfig<AssetMgtTagModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configMacAddr,
    ]
}

/** “资产管理标签”表单模型 */
const assetMgtTagForm = new FormModel(configassetMgtTagForm)

/** 查 */
function Refresh() {
    assetMgtTagTable.Refresh()
}

/** 增 */
function Add() {
    assetMgtTagForm.Title.value = '导入设备'

    assetMgtTagForm._getSource = AddGetSource

    assetMgtTagForm._onSubmit = source => {
        assetMgtTagTable.RowDatas.push(source)
        return new SubmitResult('添加成功')
    }

    assetMgtTagForm.Show()
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

    const rowData = assetMgtTagTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    assetMgtTagTable.DeleteRowData(rowData)

    dialog.ShowSuccess('删除成功')
}

export default {
    configMacAddr,
    assetMgtTagForm,
    Refresh,
    Add,
    Delete,
}