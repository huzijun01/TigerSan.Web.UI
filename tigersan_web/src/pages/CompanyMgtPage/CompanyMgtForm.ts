import { ref } from 'vue'
import { CompanyMgtModel, companyMgtTable } from './CompanyMgtTable'
import {
    Colors, dialog, Verify, ObjectHelper,
    DialogMode, DialogState, FormModel, SearchModel,
    SubmitResult, FormConfig, FormItemConfig
} from '@/0_tigersan_ui/tigerui'

/** 查找框 */
const searchCompany = new SearchModel()
searchCompany.Placeholder.value = '请输入公司名称'

/** “公司名称”项目配置 */
const configName: FormItemConfig = {
    _propName: 'Name',
    PropText: '公司名称',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var station = source as CompanyMgtModel
        return Verify.IsNotUndefinedOrEmpty(station.Name)
    }
}

/** “公司地址”项目配置 */
const configAddr: FormItemConfig = {
    _propName: 'Addr',
    PropText: '公司地址',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var station = source as CompanyMgtModel
        return Verify.IsNotUndefinedOrEmpty(station.Addr)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new CompanyMgtModel()
}

/** “公司管理”表单配置 */
let configCompanyForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configName,
        configAddr,
    ]
}

/** “公司管理”表单模型 */
const stationForm = new FormModel(configCompanyForm)

/** 查 */
function Refresh() {
    companyMgtTable.Refresh()
}

/** 增 */
function Add() {
    stationForm.Title.value = '新增基站'

    stationForm._getSource = AddGetSource

    stationForm._onSubmit = source => {
        companyMgtTable.RowDatas.push(source)
        return new SubmitResult('添加成功')
    }

    stationForm.Show()
}

/** 改 */
function Edit() {
    stationForm.Title.value = '修改基站'

    let iRow = 0

    stationForm._getSource = () => {
        const rowData = companyMgtTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return {}
        }

        iRow = companyMgtTable.RowDatas.indexOf(rowData)
        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    stationForm._onSubmit = source => {
        companyMgtTable.RowDatas[iRow] = source
        companyMgtTable.Refresh()

        return new SubmitResult('修改成功')
    }

    stationForm.Show()
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

    const rowData = companyMgtTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    companyMgtTable.DeleteRowData(rowData)

    dialog.ShowSuccess('删除成功')
}

export default {
    searchCompany,
    configName,
    configAddr,
    stationForm,
    Refresh,
    Add,
    Edit,
    Delete,
}