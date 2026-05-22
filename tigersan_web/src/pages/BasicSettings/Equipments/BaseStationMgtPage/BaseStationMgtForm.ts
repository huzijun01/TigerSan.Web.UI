import { ref, watch } from 'vue'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, SearchModel, BigintHelper, PaginationModel, ArrayHelper, SwitchModel, GetSubmitResult, IdNameModel, IsEnable, MyActionResult, OnlineStates, OnlineState, loading } from '@/0_tigersan_ui/tigerui'
import { BaseStationModel, baseStationMgtTable } from './BaseStationMgtTable'
import { companyHelper, baseStationHelper, siteHelper, stationTypeHelper } from '@/models'

// 字段:
const onlineCount = ref(0)
const offlineCount = ref(0)

// 分页器:
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

// 开关:
const switchIsEnable = new SwitchModel()
switchIsEnable.IsEnable.value = false
watch(baseStationMgtTable.IsSelected, isSelected => switchIsEnable.IsEnable.value = isSelected)
switchIsEnable._onChange = EditIsEnable

// 选择框:
/** 筛选 */
const selectState = OnlineState.GetSelectModel()
const selectIsEnable = IsEnable.GetSelectModel()
const selectCompany = companyHelper.GetIdNameSelectModel()
selectCompany._getItemsAsync = async () => await baseStationHelper.GetBelongCompanyListAsync()
const selectSite = siteHelper.GetIdNameSelectModel()
selectSite._getItemsAsync = async () => selectCompany.Value.value ? await baseStationHelper.GetBelongSiteListAsync(selectCompany.Value.value?.id) : []
const selectType = stationTypeHelper.GetIdNameSelectModel()
selectType._getItemsAsync = async () => await baseStationHelper.GetBelongStationTypeListAsync(selectCompany.Value.value?.id, selectSite.Value.value?.id)
/** 表单 */
const selectCompanyForm = companyHelper.GetIdNameSelectModel()
const selectSiteForm = siteHelper.GetIdNameSelectModel()
selectSiteForm._getItemsAsync = async () => selectCompanyForm.Value.value ? await siteHelper.SelectIdNameByCompanyAsync(selectCompanyForm.Value.value?.id) : []
const selectTypeForm = stationTypeHelper.GetIdNameSelectModel()
// 更新:
selectCompanyForm._onChange = selectSiteForm.UpdateItemsAsync
baseStationMgtTable._onSelectStateChange = InitSelectIsEnableState

// 搜索框:
const searchMacAddr = new SearchModel()
searchMacAddr.PlaceholderCN.value = 'MAC地址'
searchMacAddr.PlaceholderEN.value = 'MAC Addr'
searchMacAddr._onSearch = Refresh
searchMacAddr._onChange = Refresh

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

/** “基站”表单配置 */
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
            selectCompanyForm.Value.value = companyHelper.GetIdName(rowData.company)
            await selectSiteForm.UpdateItemsAsync()
            selectSiteForm.Value.value = siteHelper.GetIdName(rowData.site)
            await selectTypeForm.UpdateItemsAsync()
            selectTypeForm.Value.value = stationTypeHelper.GetIdName(rowData.type)
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

/** “基站”表单模型 */
const baseStationForm = new FormModel(configBaseStationForm)

async function RefreshBase() {
    InitSelectIsEnableState()

    await companyHelper.UpdateIdNames()
    await selectCompany.UpdateItemsAsync()
    await siteHelper.UpdateIdNames()
    await selectSite.UpdateItemsAsync()
    await stationTypeHelper.UpdateIdNames()
    await selectType.UpdateItemsAsync()

    onlineCount.value = await baseStationHelper.GetCount({
        company: selectCompany.Value.value?.id,
        site: selectSite.Value.value?.id,
        isEnable: selectIsEnable.Value.value,
        state: OnlineStates.Online,
        type: selectType.Value.value?.id,
        macAddr: searchMacAddr.Value.value,
    })
    offlineCount.value = await baseStationHelper.GetCount({
        company: selectCompany.Value.value?.id,
        site: selectSite.Value.value?.id,
        isEnable: selectIsEnable.Value.value,
        state: OnlineStates.Offline,
        type: selectType.Value.value?.id,
        macAddr: searchMacAddr.Value.value,
    })
    pagination.Count.value = await baseStationHelper.GetCount({
        company: selectCompany.Value.value?.id,
        site: selectSite.Value.value?.id,
        isEnable: selectIsEnable.Value.value,
        state: selectState.Value.value,
        type: selectType.Value.value?.id,
        macAddr: searchMacAddr.Value.value,
    })
}

/** 更新“行数据” */
async function UpdateRowDatas() {
    await RefreshBase()
    await baseStationHelper.GetList({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
        company: selectCompany.Value.value?.id,
        site: selectSite.Value.value?.id,
        isEnable: selectIsEnable.Value.value,
        state: selectState.Value.value,
        type: selectType.Value.value?.id,
        macAddr: searchMacAddr.Value.value,
    }).then(arr => {
        baseStationMgtTable.UpdateRowDatas(arr, (r, n) => BigintHelper.IsEqualAndNotUndefined(r.id, n.id))
    })
}

/** 查 */
async function Refresh() {
    try {
        loading.IsShow.value = true

        await RefreshBase()

        await baseStationHelper.GetList({
            pageSize: pagination.PageSize.value,
            pageNumber: pagination.SelectedNum.value,
            company: selectCompany.Value.value?.id,
            site: selectSite.Value.value?.id,
            isEnable: selectIsEnable.Value.value,
            state: selectState.Value.value,
            type: selectType.Value.value?.id,
            macAddr: searchMacAddr.Value.value,
        }).then(arr => {
            ArrayHelper.Set(baseStationMgtTable.RowDatas, arr)
        })
    } finally {
        loading.IsShow.value = false
    }
}

pagination._onChange = Refresh
selectCompany._onChange = Refresh
selectSite._onChange = Refresh
selectType._onChange = Refresh
selectState._onChange = Refresh
selectIsEnable._onChange = Refresh

/** 增 */
function Add() {
    baseStationForm.Title.value = '新增基站'

    baseStationForm._getSource = AddGetSource

    baseStationForm._onSubmitAsync = async source => {
        const res = await baseStationHelper.Add(source)
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
        const res = await baseStationHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    baseStationForm.Show(true)
}

/** 改 */
function EditIsEnable(isEnable: boolean) {
    if (!baseStationMgtTable.IsSelected.value) return

    dialog.ShowDialog(
        '修改启用状态',
        isEnable ? '是否启用' : '是否禁用',
        undefined,
        (state) => {
            if (state != DialogState.Yes) {
                InitSelectIsEnableState()
                return
            }

            const rowDatas: BaseStationModel[] = []
            baseStationMgtTable.SelectedRowDatas.value.forEach(rowData => {
                const newRowData = ObjectHelper.ShallowCopy(rowData)
                newRowData.isEnable = isEnable
                rowDatas.push(newRowData)
            })

            baseStationHelper.EditRange(rowDatas).then(res => {
                Refresh().then(InitSelectIsEnableState)
                MyActionResult.ShowResult(res)
            })
        },
        DialogMode.YesOrNo,
        Colors.Warning)
}

function InitSelectIsEnableState() {
    switchIsEnable.Value.value = baseStationMgtTable.IsSelected.value && baseStationMgtTable.SelectedRowDatas.value.every(r => r.isEnable)
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

async function DeleteRowData(state: DialogState) {
    if (state != DialogState.Yes) return

    const rowData = baseStationMgtTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    try {
        loading.IsShow.value = true

        await baseStationHelper.Delete(rowData.id).then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
    } finally {
        loading.IsShow.value = false
    }
}

function Repair() {
    dialog.ShowInformation('维修')
}

export const baseStationMgtForm = {
    pagination,
    onlineCount,
    offlineCount,
    searchMacAddr,
    switchIsEnable,
    selectState,
    selectIsEnable,
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
    UpdateRowDatas,
    Add,
    Edit,
    EditIsEnable,
    Delete,
    Repair,
}