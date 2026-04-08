import { ref } from 'vue'
import { BaseStationModel, baseStationMgtTable } from './BaseStationMgtTable'
import { baseStationMgtHelper, companyMgtHelper, GetSubmitResult, IdNameModel, MyActionResult, OnlineState, OnlineState2String, siteMgtHelper, stationTypeMgtHelper } from '@/models'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, SearchModel, SelectModel, BigintHelper, PaginationModel, ArrayHelper } from '@/0_tigersan_ui/tigerui'

// 字段:
const onlineCount = ref(0)
const offlineCount = ref(0)

// 分页器:
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

// 选择框:
/** 筛选 */
const selectCompany = companyMgtHelper.GetSelectModel()
selectCompany._getItemsAsync = async () => await baseStationMgtHelper.GetBelongCompanyListAsync()
const selectSite = siteMgtHelper.GetSelectModel()
selectSite._getItemsAsync = async () => selectCompany.Value.value ? await baseStationMgtHelper.GetBelongSiteListAsync(selectCompany.Value.value?.id) : []
const selectType = stationTypeMgtHelper.GetSelectModel()
selectType._getItemsAsync = async () => await baseStationMgtHelper.GetBelongStationTypeListAsync(selectCompany.Value.value?.id, selectSite.Value.value?.id)
/** 表单 */
const selectCompanyForm = companyMgtHelper.GetSelectModel()
const selectSiteForm = siteMgtHelper.GetSelectModel()
selectSiteForm._getItemsAsync = async () => selectCompanyForm.Value.value ? await siteMgtHelper.SelectIdNameByCompanyAsync(selectCompanyForm.Value.value?.id) : []
const selectTypeForm = stationTypeMgtHelper.GetSelectModel()
// 更新:
selectCompanyForm._onChange = selectSiteForm.UpdateItemsAsync

const searchMacAddr = new SearchModel()
searchMacAddr.Placeholder.value = '请输入MAC地址'
searchMacAddr._onSearch = Refresh

const selectState = new SelectModel<OnlineState>()
selectState.Width.value = 100
selectState.Value.value = undefined
selectState.IsAllowSearch.value = true
selectState.Items.push(...[OnlineState.Online, OnlineState.Offline])
selectState._converter = OnlineState2String

/** “公司”项目配置 */
const configCompany: FormItemConfig<BaseStationModel, IdNameModel> = {
    _propName: 'company',
    PropText: '公司',
    IsEquired: true,
    Target: selectCompanyForm.Value,
    _getValue: source => selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
    _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, '不可为空')
}

/** “场地”项目配置 */
const configSite: FormItemConfig<BaseStationModel, IdNameModel> = {
    _propName: 'site',
    PropText: '场地',
    IsEquired: true,
    Target: selectSiteForm.Value,
    _getValue: source => selectSiteForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.site)),
    _setValue: (source, propName, value) => source.site = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.site, 0n, '不可为空')
}

/** “类型”项目配置 */
const configType: FormItemConfig<BaseStationModel, IdNameModel> = {
    _propName: 'type',
    PropText: '类型',
    IsEquired: true,
    Target: selectTypeForm.Value,
    _getValue: source => selectTypeForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.type)),
    _setValue: (source, propName, value) => source.type = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.type, 0n, '不可为空')
}

/** “MAC地址”项目配置 */
const configMacAddr: FormItemConfig<BaseStationModel, string> = {
    _propName: 'macAddr',
    PropText: 'MAC地址',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.macAddr)
}

/** “名称”项目配置 */
const configName: FormItemConfig<BaseStationModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.name)
}

/** “心跳（秒）”项目配置 */
const configHeartbeatInterval: FormItemConfig<BaseStationModel, string> = {
    _propName: 'heartbeatInterval',
    PropText: '心跳（秒）',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsGreaterThan(source.heartbeatInterval)
}

/** “上报周期（秒）”项目配置 */
const configReportInterval: FormItemConfig<BaseStationModel, string> = {
    _propName: 'reportInterval',
    PropText: '上报周期（秒）',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsGreaterThan(source.reportInterval)
}

/** “增”源数据获取方法 */
const AddGetSource = () => new BaseStationModel()

/** “基站管理”表单配置 */
let configBaseStationForm: FormConfig<BaseStationModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        if (isEdit) {
            const rowData = baseStationMgtTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return
            }

            await selectCompanyForm.UpdateItemsAsync()
            selectCompanyForm.Value.value = companyMgtHelper.GetIdName(rowData.company)
            await selectSiteForm.UpdateItemsAsync()
            selectSiteForm.Value.value = siteMgtHelper.GetIdName(rowData.site)
            await selectTypeForm.UpdateItemsAsync()
            selectTypeForm.Value.value = stationTypeMgtHelper.GetIdName(rowData.type)
        }
    },
    _itemConfigs: [
        configCompany,
        configSite,
        configType,
        configName,
        configMacAddr,
        configHeartbeatInterval,
        configReportInterval,
    ]
}

/** “基站管理”表单模型 */
const baseStationForm = new FormModel(configBaseStationForm)

/** 查 */
async function Refresh() {
    await companyMgtHelper.UpdateIdNames()
    await selectCompany.UpdateItemsAsync()
    await siteMgtHelper.UpdateIdNames()
    await selectSite.UpdateItemsAsync()
    await stationTypeMgtHelper.UpdateIdNames()
    await selectType.UpdateItemsAsync()

    onlineCount.value = await baseStationMgtHelper.GetCount({
        company: selectCompany.Value.value?.id,
        site: selectSite.Value.value?.id,
        state: OnlineState.Online,
        type: selectType.Value.value?.id,
        macAddr: searchMacAddr.Value.value,
    })
    pagination.Count.value = await baseStationMgtHelper.GetCount({
        company: selectCompany.Value.value?.id,
        site: selectSite.Value.value?.id,
        state: selectState.Value.value,
        type: selectType.Value.value?.id,
        macAddr: searchMacAddr.Value.value,
    })
    offlineCount.value = pagination.Count.value - onlineCount.value
    await baseStationMgtHelper.GetListAsync({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
        company: selectCompany.Value.value?.id,
        site: selectSite.Value.value?.id,
        state: selectState.Value.value,
        type: selectType.Value.value?.id,
        macAddr: searchMacAddr.Value.value,
    }).then(arr => {
        ArrayHelper.Set(baseStationMgtTable.RowDatas, arr)
    })
}

pagination._onChange = Refresh
selectCompany._onChange = Refresh
selectSite._onChange = Refresh
selectType._onChange = Refresh
selectState._onChange = Refresh

/** 增 */
function Add() {
    baseStationForm.Title.value = '新增基站'

    baseStationForm._getSource = AddGetSource

    baseStationForm._onSubmitAsync = async source => {
        const res = await baseStationMgtHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    baseStationForm.Show()
}

/** 改 */
function Edit() {
    baseStationForm.Title.value = '修改基站'

    baseStationForm._getSource = () => {
        const rowData = baseStationMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new BaseStationModel()
        }

        return ObjectHelper.ShallowCopy(rowData)
    }

    baseStationForm._onSubmitAsync = async source => {
        const res = await baseStationMgtHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    baseStationForm.Show(true)
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

    const rowData = baseStationMgtTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    baseStationMgtHelper.Delete(rowData.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

function Repair() {
    dialog.ShowInformation('维修')
}

export default {
    pagination,
    onlineCount,
    offlineCount,
    searchMacAddr,
    selectState,
    selectCompany,
    selectSite,
    selectType,
    selectCompanyForm,
    selectSiteForm,
    selectTypeForm,
    configCompany,
    configSite,
    configType,
    configName,
    configMacAddr,
    configHeartbeatInterval,
    configReportInterval,
    baseStationForm,
    Refresh,
    Add,
    Edit,
    Delete,
    Repair,
}