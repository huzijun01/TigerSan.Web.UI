import { ref } from 'vue'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, ArrayHelper, BigintHelper, SearchModel, GetSubmitResult, IdNameModel, MyActionResult, OnlineState } from '@/0_tigersan_ui/tigerui'
import { assetMgtTable, pagination } from './AssetMgtTable'
import { companyHelper, assetHelper, departmentHelper, assetTypeHelper, AssetState, AssetModel, ErrorType, siteHelper } from '@/models'

// 选择框:
/** 筛选 */
const selectOnlineState = OnlineState.GetSelectModel()
const selectCompany = companyHelper.GetIdNameSelectModel()
const selectDepartment = departmentHelper.GetIdNameSelectModel()
selectDepartment._getItemsAsync = async () => selectCompany.Value.value ? await departmentHelper.SelectIdNameByCompanyAsync(selectCompany.Value.value?.id) : []
const selectAssetType = assetTypeHelper.GetIdNameSelectModel()
const selectAssetState = AssetState.GetSelectModel()
const selectErrorType = ErrorType.GetSelectModel()
/** 表单 */
const selectCompanyForm = companyHelper.GetIdNameSelectModel()
const selectDepartmentForm = departmentHelper.GetIdNameSelectModel()
selectDepartmentForm._getItemsAsync = async () => selectCompanyForm.Value.value ? await departmentHelper.SelectIdNameByCompanyAsync(selectCompanyForm.Value.value?.id) : []
const selectAssetTypeForm = assetTypeHelper.GetIdNameSelectModel()
// 出库:
const selectCompanyOutboundForm = companyHelper.GetIdNameSelectModel()
const selectSiteOutboundForm = siteHelper.GetIdNameSelectModel()
selectSiteOutboundForm._getItemsAsync = async () => selectCompanyForm.Value.value ? await siteHelper.SelectIdNameByCompanyAsync(selectCompanyForm.Value.value?.id) : []
// 更新:
selectCompanyForm._onChange = selectDepartmentForm.UpdateItemsAsync
selectCompanyOutboundForm._onChange = selectSiteOutboundForm.UpdateItemsAsync

/** 搜索框 */
const searchAssetId = new SearchModel()
searchAssetId.PlaceholderCN.value = '资产ID'
searchAssetId.PlaceholderEN.value = 'Asset ID'
searchAssetId._onChange = Refresh
searchAssetId._onSearch = Refresh

/** “公司”项目配置 */
const configCompany: FormItemConfig<AssetModel, IdNameModel> = {
    _propName: 'company',
    PropText: '公司',
    IsEquired: true,
    Target: selectCompanyForm.Value,
    _getValue: source => selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
    _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, '不可为空')
}

/** “部门”项目配置 */
const configDepartment: FormItemConfig<AssetModel, IdNameModel> = {
    _propName: 'department',
    PropText: '部门',
    IsEquired: true,
    Target: selectDepartmentForm.Value,
    _getValue: source => selectDepartmentForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.department)),
    _setValue: (source, propName, value) => source.department = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.department, 0n, '不可为空')
}

/** “类型”项目配置 */
const configAssetType: FormItemConfig<AssetModel, IdNameModel> = {
    _propName: 'type',
    PropText: '类型',
    IsEquired: true,
    Target: selectAssetTypeForm.Value,
    _getValue: source => selectAssetTypeForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.type)),
    _setValue: (source, propName, value) => source.type = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.type, 0n, '不可为空')
}

/** “资产ID”项目配置 */
const configAssetId: FormItemConfig<AssetModel, string> = {
    _propName: 'assetId',
    PropText: '资产ID',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.assetId)
}

/** “标签ID”项目配置 */
const configTagId: FormItemConfig<AssetModel, string> = {
    _propName: 'tagId',
    PropText: '标签ID',
    IsEquired: false,
    Target: ref(),
}

/** “名称”项目配置 */
const configName: FormItemConfig<AssetModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: false,
    Target: ref(),
}

/** “备注”项目配置 */
const configComment: FormItemConfig<AssetModel, string> = {
    _propName: 'comment',
    PropText: '备注',
    IsEquired: false,
    Target: ref(),
}

/** “增”源数据获取方法 */
const AddGetSource = () => new AssetModel()

/** “资产”表单配置 */
let configAssetMgtForm: FormConfig<AssetModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        if (isEdit) {
            const rowData = assetMgtTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return
            }

            await selectCompanyForm.UpdateItemsAsync()
            selectCompanyForm.Value.value = companyHelper.GetIdName(rowData.company)
            await selectDepartmentForm.UpdateItemsAsync()
            selectDepartmentForm.Value.value = departmentHelper.GetIdName(rowData.department)
            await selectAssetTypeForm.UpdateItemsAsync()
            selectAssetTypeForm.Value.value = assetTypeHelper.GetIdName(rowData.type)
        }
    },
    _itemConfigs: [
        configCompany,
        configDepartment,
        configAssetType,
        configAssetId,
        configTagId,
        configName,
        configComment,
    ]
}

/** “资产”表单模型 */
const assetForm = new FormModel(configAssetMgtForm)

/** 查 */
async function Refresh() {
    await companyHelper.UpdateIdNames()
    await departmentHelper.UpdateIdNames()
    await assetTypeHelper.UpdateIdNames()
    await selectCompany.UpdateItemsAsync()
    await selectDepartment.UpdateItemsAsync()
    await selectAssetType.UpdateItemsAsync()

    pagination.Count.value = await assetHelper.GetCount({
        company: selectCompany.Value.value?.id,
        department: selectDepartment.Value.value?.id,
        type: selectAssetType.Value.value?.id,
        state: selectAssetState.Value.value,
        onlineState: selectOnlineState.Value.value,
        errorType: selectErrorType.Value.value,
        assetId: searchAssetId.Value.value,
    })
    await assetHelper.GetList({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
        company: selectCompany.Value.value?.id,
        department: selectDepartment.Value.value?.id,
        type: selectAssetType.Value.value?.id,
        state: selectAssetState.Value.value,
        onlineState: selectOnlineState.Value.value,
        errorType: selectErrorType.Value.value,
        assetId: searchAssetId.Value.value,
    }).then(arr => {
        ArrayHelper.Set(assetMgtTable.RowDatas, arr)
    })
}

pagination._onChange = Refresh
selectCompany._onChange = Refresh
selectDepartment._onChange = Refresh
selectAssetType._onChange = Refresh
selectAssetState._onChange = Refresh
selectOnlineState._onChange = Refresh
selectErrorType._onChange = Refresh

/** 增 */
async function Add() {
    assetForm.Title.value = '新增资产'

    assetForm._getSource = AddGetSource

    assetForm._onSubmitAsync = async source => {
        const res = await assetHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    assetForm.Show()
}

/** 改 */
async function Edit() {
    assetForm.Title.value = '修改资产'

    assetForm._getSource = () => {
        const rowData = assetMgtTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new AssetModel()
        }

        return ObjectHelper.ShallowCopy(rowData)
    }

    assetForm._onSubmitAsync = async source => {
        const res = await assetHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    assetForm.Show(true)
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

    const model = assetMgtTable.SelectedRowDatas.value[0]
    if (!model) {
        console.warn('The model is undefined!')
        return {}
    }

    assetHelper.Delete(model.id).then(res => {
        Refresh()
        MyActionResult.ShowResult(res, '删除成功')
    })
}

class OutboundModel {
    company: bigint = 0n
    site: bigint = 0n
}

/** “公司”项目配置 */
const configOutboundCompany: FormItemConfig<OutboundModel, IdNameModel> = {
    _propName: 'company',
    PropText: '公司',
    IsEquired: true,
    Target: selectCompanyOutboundForm.Value,
    _getValue: source => selectCompanyOutboundForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
    _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, '不可为空')
}

/** “场地”项目配置 */
const configSite: FormItemConfig<OutboundModel, IdNameModel> = {
    _propName: 'site',
    PropText: '场地',
    IsEquired: true,
    Target: selectSiteOutboundForm.Value,
    _getValue: source => selectSiteOutboundForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.site)),
    _setValue: (source, propName, value) => source.site = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.site, 0n, '不可为空')
}

/** “出库”表单配置 */
let configOutbundForm: FormConfig<OutboundModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: () => new OutboundModel(),
    _beforeInitAsync: async isEdit => {
        if (isEdit) {
            const rowData = assetMgtTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return
            }

            await selectCompanyForm.UpdateItemsAsync()
            selectCompanyForm.Value.value = companyHelper.GetIdName(rowData.company)
            await selectDepartmentForm.UpdateItemsAsync()
            selectDepartmentForm.Value.value = departmentHelper.GetIdName(rowData.department)
            await selectAssetTypeForm.UpdateItemsAsync()
            selectAssetTypeForm.Value.value = assetTypeHelper.GetIdName(rowData.type)
        }
    },
    _itemConfigs: [
        configOutboundCompany,
        configSite,
    ]
}

/** “出库”表单模型 */
const assetOutbundForm = new FormModel(configOutbundForm)

/** 入库 */
async function Inbound() {
    dialog.ShowDialog(
        '确认',
        '是否确定入库？',
        undefined,
        InboundRowData,
        DialogMode.YesOrNo,
        Colors.Warning)
}

function InboundRowData(state: DialogState) {
    if (state != DialogState.Yes) return

    const rowDatas = assetMgtTable.SelectedRowDatas.value
    if (rowDatas.length < 1) return

    assetHelper.Inbound(rowDatas.map(r => r.id)).then(res => {
        Refresh()
        MyActionResult.ShowResult(res, '入库成功')
    })
}

/** 出库 */
async function Outbound() {
    const rowDatas = assetMgtTable.SelectedRowDatas.value
    if (rowDatas.length < 1) return

    assetOutbundForm.Title.value = '出库'

    assetOutbundForm._onSubmitAsync = async source => {
        const res = await assetHelper.Outbound(source.site, rowDatas.map(r => r.id))
        await Refresh()
        return GetSubmitResult(res, '出库成功')
    }

    assetOutbundForm.Show(true)
}

export const assetMgtForm = {
    searchAssetId,
    selectOnlineState,
    selectCompany,
    selectDepartment,
    selectAssetType,
    selectAssetState,
    selectErrorType,
    selectCompanyForm,
    selectDepartmentForm,
    selectAssetTypeForm,
    selectCompanyOutboundForm,
    selectSiteOutboundForm,
    configCompany,
    configDepartment,
    configAssetType,
    configAssetId,
    configTagId,
    configName,
    configComment,
    assetForm,
    configOutboundCompany,
    configSite,
    configOutbundForm,
    assetOutbundForm,
    Refresh,
    Add,
    Edit,
    Delete,
    Inbound,
    Outbound,
}