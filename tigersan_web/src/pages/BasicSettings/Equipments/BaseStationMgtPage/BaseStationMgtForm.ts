import { ref, watch } from 'vue'
import { Colors, DialogHelper, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, SearchModel, BigintHelper, PaginationModel, ArrayHelper, SwitchModel, GetSubmitResult, IdNameModel, IsEnable, MyActionResult, OnlineStates, OnlineState, loading, Texts, TextModel } from '@/0_tigersan_ui/tigerui'
import { baseStationMgtTable } from './BaseStationMgtTable'
import { companyHelper, baseStationHelper, siteHelper, stationTypeHelper, BaseStationModel } from '@/models'

export class BaseStationMgtForm {
    //#region 【Fields】
    readonly OnlineCount = ref(0)
    readonly OfflineCount = ref(0)

    /** 分页器 */
    readonly pagination = new PaginationModel()
    /** 开关 */
    readonly switchIsEnable = new SwitchModel()
    /** 搜索框 */
    readonly searchMacAddr = new SearchModel()

    // 选择框:
    /** 筛选 */
    readonly selectState = OnlineState.GetSelectModel()
    readonly selectIsEnable = IsEnable.GetSelectModel()
    readonly selectCompany = companyHelper.GetIdNameSelectModel()
    readonly selectSite = siteHelper.GetIdNameSelectModel()
    readonly selectType = stationTypeHelper.GetIdNameSelectModel()
    /** 表单 */
    readonly selectCompanyForm = companyHelper.GetIdNameSelectModel()
    readonly selectSiteForm = siteHelper.GetIdNameSelectModel()
    readonly selectTypeForm = stationTypeHelper.GetIdNameSelectModel()

    /** “公司”项目配置 */
    readonly configCompany: FormItemConfig<BaseStationModel, IdNameModel> = {
        _propName: 'company',
        PropText: Texts.Company,
        IsEquired: true,
        Target: this.selectCompanyForm.Value,
        _getValue: source => this.selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
        _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, Texts.CannotBeEmpty.value)
    }

    /** “场地”项目配置 */
    readonly configSite: FormItemConfig<BaseStationModel, IdNameModel> = {
        _propName: 'site',
        PropText: Texts.Site,
        IsEquired: true,
        Target: this.selectSiteForm.Value,
        _getValue: source => this.selectSiteForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.site)),
        _setValue: (source, propName, value) => source.site = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.site, 0n, Texts.CannotBeEmpty.value)
    }

    /** “类型”项目配置 */
    readonly configType: FormItemConfig<BaseStationModel, IdNameModel> = {
        _propName: 'type',
        PropText: Texts.Type,
        IsEquired: true,
        Target: this.selectTypeForm.Value,
        _getValue: source => this.selectTypeForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.type)),
        _setValue: (source, propName, value) => source.type = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.type, 0n, Texts.CannotBeEmpty.value)
    }

    /** “MAC地址”项目配置 */
    readonly configMacAddr: FormItemConfig<BaseStationModel, string> = {
        _propName: 'macAddr',
        PropText: Texts.MacAddr,
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.macAddr)
    }

    /** “名称”项目配置 */
    readonly configName: FormItemConfig<BaseStationModel, string> = {
        _propName: 'name',
        PropText: Texts.Name,
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.name)
    }

    /** “心跳（秒）”项目配置 */
    readonly configHeartbeatInterval: FormItemConfig<BaseStationModel, string> = {
        _propName: 'heartbeatInterval',
        PropText: TextModel.Computed('HeartbeatInterval', '心跳（秒）'),
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsGreaterThan(source.heartbeatInterval)
    }

    /** “上报周期（秒）”项目配置 */
    readonly configReportInterval: FormItemConfig<BaseStationModel, string> = {
        _propName: 'reportInterval',
        PropText: TextModel.Computed('ReportInterval', '上报周期（秒）'),
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsGreaterThan(source.reportInterval)
    }

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => new BaseStationModel()

    /** “基站”表单配置 */
    readonly configBaseStationForm: FormConfig<BaseStationModel> = {
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
            if (isEdit) {
                const rowData = baseStationMgtTable.SelectedRowDatas.value[0]
                if (!rowData) {
                    console.warn('The rowData is undefined!')
                    return
                }

                await this.selectCompanyForm.UpdateItemsAsync()
                this.selectCompanyForm.Value.value = companyHelper.GetIdName(rowData.company)
                await this.selectSiteForm.UpdateItemsAsync()
                this.selectSiteForm.Value.value = siteHelper.GetIdName(rowData.site)
                await this.selectTypeForm.UpdateItemsAsync()
                this.selectTypeForm.Value.value = stationTypeHelper.GetIdName(rowData.type)
            }
        },
        _itemConfigs: [
            this.configCompany,
            this.configSite,
            this.configType,
            this.configName,
            this.configMacAddr,
            this.configHeartbeatInterval,
            this.configReportInterval,
        ]
    }

    /** “基站”表单模型 */
    readonly baseStationForm = new FormModel(this.configBaseStationForm)
    //#endregion 【Fields】

    //#region 【Ctor】
    constructor() {
        baseStationMgtTable._onSelectStateChange = this.InitSelectIsEnableState
        watch(baseStationMgtTable.IsSelected, isSelected => this.switchIsEnable.IsEnable.value = isSelected)

        this.pagination.IsShowSelectedRowCount.value = true
        this.switchIsEnable.IsEnable.value = false
        this.switchIsEnable._onChange = this.EditIsEnable
        this.searchMacAddr.Placeholder.value = Texts.MacAddr
        this.selectCompany._getItemsAsync = async () => await baseStationHelper.GetBelongCompanyListAsync()
        this.selectSite._getItemsAsync = async () => await baseStationHelper.GetBelongSiteListAsync(this.selectCompany.Value.value?.id)
        this.selectType._getItemsAsync = async () => await baseStationHelper.GetBelongStationTypeListAsync(this.selectCompany.Value.value?.id, this.selectSite.Value.value?.id)
        this.selectSiteForm._getItemsAsync = async () => await siteHelper.SelectIdNameByCompanyAsync(this.selectCompanyForm.Value.value?.id)

        // 更新:
        this.selectCompanyForm._onChange = this.selectSiteForm.UpdateItemsAsync
        this.searchMacAddr._onSearch = this.Refresh
        this.searchMacAddr._onChange = this.Refresh
        this.pagination._onChange = this.Refresh
        this.selectCompany._onChange = this.Refresh
        this.selectSite._onChange = this.Refresh
        this.selectType._onChange = this.Refresh
        this.selectState._onChange = this.Refresh
        this.selectIsEnable._onChange = this.Refresh
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    readonly RefreshBase = async () => {
        this.InitSelectIsEnableState()

        await companyHelper.UpdateIdNames()
        await this.selectCompany.UpdateItemsAsync()
        await siteHelper.UpdateIdNames()
        await this.selectSite.UpdateItemsAsync()
        await stationTypeHelper.UpdateIdNames()
        await this.selectType.UpdateItemsAsync()

        this.OnlineCount.value = await baseStationHelper.GetCount({
            company: this.selectCompany.Value.value?.id,
            site: this.selectSite.Value.value?.id,
            isEnable: this.selectIsEnable.Value.value,
            state: OnlineStates.Online,
            type: this.selectType.Value.value?.id,
            macAddr: this.searchMacAddr.Value.value,
        })
        this.OfflineCount.value = await baseStationHelper.GetCount({
            company: this.selectCompany.Value.value?.id,
            site: this.selectSite.Value.value?.id,
            isEnable: this.selectIsEnable.Value.value,
            state: OnlineStates.Offline,
            type: this.selectType.Value.value?.id,
            macAddr: this.searchMacAddr.Value.value,
        })
        this.pagination.Count.value = await baseStationHelper.GetCount({
            company: this.selectCompany.Value.value?.id,
            site: this.selectSite.Value.value?.id,
            isEnable: this.selectIsEnable.Value.value,
            state: this.selectState.Value.value,
            type: this.selectType.Value.value?.id,
            macAddr: this.searchMacAddr.Value.value,
        })
    }

    /** 更新“行数据” */
    readonly UpdateRowDatas = async () => {
        await this.RefreshBase()
        await baseStationHelper.GetList({
            pageSize: this.pagination.PageSize.value,
            pageNumber: this.pagination.SelectedNum.value,
            company: this.selectCompany.Value.value?.id,
            site: this.selectSite.Value.value?.id,
            isEnable: this.selectIsEnable.Value.value,
            state: this.selectState.Value.value,
            type: this.selectType.Value.value?.id,
            macAddr: this.searchMacAddr.Value.value,
        }).then(arr => {
            baseStationMgtTable.UpdateRowDatas(arr, (r, n) => BigintHelper.IsEqualAndNotUndefined(r.id, n.id))
        })
    }

    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            await this.RefreshBase()

            await baseStationHelper.GetList({
                pageSize: this.pagination.PageSize.value,
                pageNumber: this.pagination.SelectedNum.value,
                company: this.selectCompany.Value.value?.id,
                site: this.selectSite.Value.value?.id,
                isEnable: this.selectIsEnable.Value.value,
                state: this.selectState.Value.value,
                type: this.selectType.Value.value?.id,
                macAddr: this.searchMacAddr.Value.value,
            }).then(arr => {
                ArrayHelper.Set(baseStationMgtTable.RowDatas, arr)
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 增 */
    readonly Add = () => {
        this.baseStationForm.Title.value = TextModel.GetText('Add BaseStation', '新增基站')

        this.baseStationForm._getSource = this.AddGetSource

        this.baseStationForm._onSubmitAsync = async source => {
            const res = await baseStationHelper.Add(source)
            await this.Refresh()
            return GetSubmitResult(res, Texts.AddedSuccessfully.value)
        }

        this.baseStationForm.Show()
    }

    /** 改 */
    readonly Edit = () => {
        this.baseStationForm.Title.value = TextModel.GetText('Edit BaseStation', '修改基站')

        this.baseStationForm._getSource = () => {
            const rowData = baseStationMgtTable.SelectedRowDatas.value[0]

            if (!rowData) {
                console.warn('The rowData is undefined!')
                return new BaseStationModel()
            }

            return ObjectHelper.ShallowCopy(rowData)
        }

        this.baseStationForm._onSubmitAsync = async source => {
            const res = await baseStationHelper.Edit(source)
            await this.Refresh()
            return GetSubmitResult(res, Texts.EditedSuccessfully.value)
        }

        this.baseStationForm.Show(true)
    }

    /** 改 */
    readonly EditIsEnable = (isEnable: boolean) => {
        if (!baseStationMgtTable.IsSelected.value) return

        DialogHelper.Show(
            '修改启用状态',
            isEnable ? '是否启用' : '是否禁用',
            undefined,
            async (state) => {
                try {
                    loading.IsShow.value = true

                    if (state != DialogState.Yes) {
                        this.InitSelectIsEnableState()
                        return
                    }

                    const rowDatas: BaseStationModel[] = []
                    baseStationMgtTable.SelectedRowDatas.value.forEach(rowData => {
                        const newRowData = ObjectHelper.ShallowCopy(rowData)
                        newRowData.isEnable = isEnable
                        rowDatas.push(newRowData)
                    })

                    const res = await baseStationHelper.EditRange(rowDatas)
                    this.Refresh()
                    this.InitSelectIsEnableState()
                    MyActionResult.ShowResult(res)
                } finally {
                    loading.IsShow.value = false
                }
            },
            DialogMode.YesOrNo,
            Colors.Warning)
    }

    readonly InitSelectIsEnableState = () => {
        this.switchIsEnable.Value.value = baseStationMgtTable.IsSelected.value && baseStationMgtTable.SelectedRowDatas.value.every(r => r.isEnable)
    }

    /** 删 */
    readonly Delete = () => {
        DialogHelper.Show(
            Texts.Confirm,
            Texts.DeleteConfirm.value,
            undefined,
            this.DeleteRowData,
            DialogMode.YesOrNo,
            Colors.Warning)
    }

    readonly DeleteRowData = async (state: DialogState) => {
        if (state != DialogState.Yes) return

        const rowData = baseStationMgtTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return
        }

        try {
            loading.IsShow.value = true

            await baseStationHelper.Delete(rowData.id).then(res => {
                this.Refresh()
                MyActionResult.ShowResult(res, Texts.DeletedSuccessfully.value)
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    readonly Repair = () => {
        DialogHelper.Information('维修')
    }
    //#endregion 【Functions】
}