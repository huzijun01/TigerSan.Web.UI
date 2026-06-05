import { ref } from 'vue'
import { Colors, DialogHelper, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, ArrayHelper, BigintHelper, GetSubmitResult, IdNameModel, MyActionResult, loading } from '@/0_tigersan_ui/tigerui'
import { AssetFilter } from './AssetFilter'
import { assetLedgerTable, pagination } from './AssetLedgerTable'
import { companyHelper, assetHelper, departmentHelper, assetTypeHelper, AssetModel, siteHelper, tagTypeHelper } from '@/models'

export class OutboundModel {
    company: bigint = 0n
    site: bigint = 0n
}

export class AssetLedgerForm {
    //#region 【Fields】
    /** 筛选器 */
    readonly filter: AssetFilter

    // 选择框:
    /** 表单 */
    readonly selectCompanyForm = companyHelper.GetIdNameSelectModel()
    readonly selectDepartmentForm = departmentHelper.GetIdNameSelectModel()
    readonly selectAssetTypeForm = assetTypeHelper.GetIdNameSelectModel()
    // 出库:
    readonly selectCompanyOutboundForm = companyHelper.GetIdNameSelectModel()
    readonly selectSiteOutboundForm = siteHelper.GetIdNameSelectModel()

    /** “公司”项目配置 */
    readonly configCompany: FormItemConfig<AssetModel, IdNameModel> = {
        _propName: 'company',
        PropText: '公司',
        IsEquired: true,
        Target: this.selectCompanyForm.Value,
        _getValue: source => this.selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
        _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, '不可为空')
    }

    /** “部门”项目配置 */
    readonly configDepartment: FormItemConfig<AssetModel, IdNameModel> = {
        _propName: 'department',
        PropText: '部门',
        IsEquired: true,
        Target: this.selectDepartmentForm.Value,
        _getValue: source => this.selectDepartmentForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.department)),
        _setValue: (source, propName, value) => source.department = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.department, 0n, '不可为空')
    }

    /** “类型”项目配置 */
    readonly configAssetType: FormItemConfig<AssetModel, IdNameModel> = {
        _propName: 'type',
        PropText: '类型',
        IsEquired: true,
        Target: this.selectAssetTypeForm.Value,
        _getValue: source => this.selectAssetTypeForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.type)),
        _setValue: (source, propName, value) => source.type = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.type, 0n, '不可为空')
    }

    /** “资产ID”项目配置 */
    readonly configAssetId: FormItemConfig<AssetModel, string> = {
        _propName: 'assetId',
        PropText: '资产ID',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.assetId)
    }

    /** “标签ID”项目配置 */
    readonly configTagId: FormItemConfig<AssetModel, string> = {
        _propName: 'tagId',
        PropText: '标签ID',
        IsEquired: false,
        Target: ref(),
    }

    /** “名称”项目配置 */
    readonly configName: FormItemConfig<AssetModel, string> = {
        _propName: 'name',
        PropText: '名称',
        IsEquired: false,
        Target: ref(),
    }

    /** “备注”项目配置 */
    readonly configComment: FormItemConfig<AssetModel, string> = {
        _propName: 'comment',
        PropText: '备注',
        IsEquired: false,
        Target: ref(),
    }

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => new AssetModel()

    /** “资产”表单配置 */
    readonly configAssetLedgerForm: FormConfig<AssetModel> = {
        CancelText: '取消',
        SubmitText: '确定',
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
            if (isEdit) {
                const rowData = assetLedgerTable.SelectedRowDatas.value[0]
                if (!rowData) {
                    console.warn('The rowData is undefined!')
                    return
                }

                await this.selectCompanyForm.UpdateItemsAsync()
                this.selectCompanyForm.Value.value = companyHelper.GetIdName(rowData.company)
                await this.selectDepartmentForm.UpdateItemsAsync()
                this.selectDepartmentForm.Value.value = departmentHelper.GetIdName(rowData.department)
                await this.selectAssetTypeForm.UpdateItemsAsync()
                this.selectAssetTypeForm.Value.value = assetTypeHelper.GetIdName(rowData.type)
            }
        },
        _itemConfigs: [
            this.configCompany,
            this.configDepartment,
            this.configAssetType,
            this.configAssetId,
            this.configTagId,
            this.configName,
            this.configComment,
        ]
    }

    /** “资产”表单模型 */
    readonly assetForm = new FormModel(this.configAssetLedgerForm)
    //#endregion 【Fields】

    //#region 【Ctor】
    constructor() {
        this.filter = new AssetFilter(this.Refresh)
        pagination._onChange = this.Refresh
        this.selectDepartmentForm._getItemsAsync = async () => this.selectCompanyForm.Value.value ? await departmentHelper.SelectIdNameByCompanyAsync(this.selectCompanyForm.Value.value?.id) : []
        this.selectSiteOutboundForm._getItemsAsync = async () => this.selectCompanyForm.Value.value ? await siteHelper.SelectIdNameByCompanyAsync(this.selectCompanyForm.Value.value?.id) : []
        // 更新:
        this.selectCompanyForm._onChange = this.selectDepartmentForm.UpdateItemsAsync
        this.selectCompanyOutboundForm._onChange = this.selectSiteOutboundForm.UpdateItemsAsync
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            const filter = this.filter
            await this.filter.UpdateIdNames()
            await tagTypeHelper.UpdateIdNames()

            pagination.Count.value = await assetHelper.GetCount({
                company: filter.selectCompany.Value.value?.id,
                department: filter.selectDepartment.Value.value?.id,
                type: filter.selectAssetType.Value.value?.id,
                tagType: filter.selectTagType.Value.value?.id,
                state: filter.selectAssetState.Value.value,
                states: filter.selectAssetState.NotCheckAllCheckedValues.value,
                onlineState: filter.selectOnlineState.Value.value,
                errorType: filter.selectErrorType.Value.value,
                assetId: filter.searchAssetId.Value.value,
                rfid: filter.searchRfid.Value.value,
            })

            await assetHelper.GetList({
                pageSize: pagination.PageSize.value,
                pageNumber: pagination.SelectedNum.value,
                company: filter.selectCompany.Value.value?.id,
                department: filter.selectDepartment.Value.value?.id,
                type: filter.selectAssetType.Value.value?.id,
                tagType: filter.selectTagType.Value.value?.id,
                state: filter.selectAssetState.Value.value,
                states: filter.selectAssetState.NotCheckAllCheckedValues.value,
                onlineState: filter.selectOnlineState.Value.value,
                errorType: filter.selectErrorType.Value.value,
                assetId: filter.searchAssetId.Value.value,
                rfid: filter.searchRfid.Value.value,
            }).then(arr => {
                ArrayHelper.Set(assetLedgerTable.RowDatas, arr)
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 增 */
    readonly Add = async () => {
        this.assetForm.Title.value = '新增资产'

        this.assetForm._getSource = this.AddGetSource

        this.assetForm._onSubmitAsync = async source => {
            const res = await assetHelper.Add(source)
            await this.Refresh()
            return GetSubmitResult(res, '添加成功')
        }

        this.assetForm.Show()
    }

    /** 改 */
    readonly Edit = async () => {
        this.assetForm.Title.value = '修改资产'

        this.assetForm._getSource = () => {
            const rowData = assetLedgerTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return new AssetModel()
            }

            return ObjectHelper.ShallowCopy(rowData)
        }

        this.assetForm._onSubmitAsync = async source => {
            const res = await assetHelper.Edit(source)
            await this.Refresh()
            return GetSubmitResult(res, '修改成功')
        }

        this.assetForm.Show(true)
    }

    /** 删 */
    readonly Delete = () => {
        DialogHelper.ShowDialog(
            '确认',
            '是否确定删除？',
            undefined,
            this.DeleteRowData,
            DialogMode.YesOrNo,
            Colors.Warning)
    }

    readonly DeleteRowData = async (state: DialogState) => {
        if (state != DialogState.Yes) return

        const models = assetLedgerTable.SelectedRowDatas.value
        if (!models) {
            console.warn('The models is undefined!')
            return {}
        }

        try {
            loading.IsShow.value = true

            await assetHelper.DeleteRange(models.map(i => i.id)).then(res => {
                this.Refresh()
                MyActionResult.ShowResult(res, '删除成功')
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    /** “公司”项目配置 */
    readonly configOutboundCompany: FormItemConfig<OutboundModel, IdNameModel> = {
        _propName: 'company',
        PropText: '公司',
        IsEquired: true,
        Target: this.selectCompanyOutboundForm.Value,
        _getValue: source => this.selectCompanyOutboundForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
        _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, '不可为空')
    }

    /** “场地”项目配置 */
    readonly configSite: FormItemConfig<OutboundModel, IdNameModel> = {
        _propName: 'site',
        PropText: '场地',
        IsEquired: true,
        Target: this.selectSiteOutboundForm.Value,
        _getValue: source => this.selectSiteOutboundForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.site)),
        _setValue: (source, propName, value) => source.site = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.site, 0n, '不可为空')
    }

    /** “出库”表单配置 */
    readonly configOutbundForm: FormConfig<OutboundModel> = {
        CancelText: '取消',
        SubmitText: '确定',
        _getSource: () => new OutboundModel(),
        _beforeInitAsync: async isEdit => {
            if (isEdit) {
                const rowData = assetLedgerTable.SelectedRowDatas.value[0]
                if (!rowData) {
                    console.warn('The rowData is undefined!')
                    return
                }

                await this.selectCompanyForm.UpdateItemsAsync()
                this.selectCompanyForm.Value.value = companyHelper.GetIdName(rowData.company)
                await this.selectDepartmentForm.UpdateItemsAsync()
                this.selectDepartmentForm.Value.value = departmentHelper.GetIdName(rowData.department)
                await this.selectAssetTypeForm.UpdateItemsAsync()
                this.selectAssetTypeForm.Value.value = assetTypeHelper.GetIdName(rowData.type)
            }
        },
        _itemConfigs: [
            this.configOutboundCompany,
            this.configSite,
        ]
    }

    /** “出库”表单模型 */
    readonly assetOutbundForm = new FormModel(this.configOutbundForm)

    /** 入库 */
    readonly Inbound = async () => {
        DialogHelper.ShowDialog(
            '确认',
            '是否确定入库？',
            undefined,
            this.InboundRowData,
            DialogMode.YesOrNo,
            Colors.Warning)
    }

    readonly InboundRowData = (state: DialogState) => {
        if (state != DialogState.Yes) return

        const rowDatas = assetLedgerTable.SelectedRowDatas.value
        if (rowDatas.length < 1) return

        assetHelper.Inbound(rowDatas.map(r => r.id)).then(res => {
            this.Refresh()
            MyActionResult.ShowResult(res, '入库成功')
        })
    }

    /** 出库 */
    readonly Outbound = async () => {
        const rowDatas = assetLedgerTable.SelectedRowDatas.value
        if (rowDatas.length < 1) return

        this.assetOutbundForm.Title.value = '出库'

        this.assetOutbundForm._onSubmitAsync = async source => {
            const res = await assetHelper.Outbound(source.site, rowDatas.map(r => r.id))
            await this.Refresh()
            return GetSubmitResult(res, '出库成功')
        }

        this.assetOutbundForm.Show(true)
    }
    //#endregion 【Functions】
}