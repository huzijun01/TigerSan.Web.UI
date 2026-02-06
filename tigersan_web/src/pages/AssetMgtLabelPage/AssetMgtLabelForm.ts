import { ref, type InputHTMLAttributes } from 'vue'
import { Colors } from '@/0_tigersan_ui/base'
import { dialog } from '@/0_tigersan_ui/stores'
import { AssetMgtLabelModel, assetMgtLabelTable } from './AssetMgtLabelTable'
import { DialogMode, DialogState, FormModel, SubmitResult, FormResult, VerifyResult, FormConfig, FormItemConfig } from '@/0_tigersan_ui/models'

/** “MAC地址”项目配置 */
const configMacAddr: FormItemConfig = {
    _propName: 'MacAddr',
    PropText: 'MAC地址',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var res = new VerifyResult()

        var AssetMgtLabel = source as AssetMgtLabelModel
        if (AssetMgtLabel.MacAddr.trim() === '') {
            res.VerifyText = '请输入MAC地址'
            res.VerifyState = FormResult.Error
        }

        return res
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new AssetMgtLabelModel()
}

/** “资产管理标签”表单配置 */
let configAssetMgtLabelForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configMacAddr,
    ]
}

/** “资产管理标签”表单模型 */
const AssetMgtLabelForm = new FormModel(configAssetMgtLabelForm)

// 【方法】:
function SetMacAddr(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    if (configMacAddr.SetSource) {
        configMacAddr.SetSource(input.value)
    }
}

/** 查 */
function Refresh() {
    assetMgtLabelTable.Refresh()
}

/** 增 */
function Add() {
    AssetMgtLabelForm.Title.value = '导入设备'

    AssetMgtLabelForm._getSource = AddGetSource

    AssetMgtLabelForm._onSubmit = source => {
        assetMgtLabelTable.RowDatas.push(source)
        assetMgtLabelTable.Refresh()

        return new SubmitResult('添加成功')
    }

    AssetMgtLabelForm.Show()
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
        console.log('The rowData is undefined!')
        return {}
    }

    assetMgtLabelTable.RowDatas = assetMgtLabelTable.RowDatas.filter(r => r != rowData)
    assetMgtLabelTable.Refresh()

    dialog.ShowSuccess('删除成功')
}

export {
    configMacAddr,
    AssetMgtLabelForm,
    SetMacAddr,
    Refresh,
    Add,
    Delete,
}