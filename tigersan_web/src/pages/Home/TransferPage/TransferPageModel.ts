import { ref } from 'vue'
import { PaginationModel, FormItemConfig, IdNameModel, Verify, FormConfig, FormModel, TableModel, ItemType, loading, ArrayHelper, GetSubmitResult, ObjectHelper, DialogHelper, DialogMode, Colors, DialogState, MyActionResult, BigintHelper, Texts, SearchModel, IsEnd, StringHelper } from '@/0_tigersan_ui/tigerui'
import { siteHelper, transferHelper, TransferModel } from '@/models'

export class TransferPageModel {
    //#region 【Fields】
    /** “编号”搜索框 */
    readonly searchCode = new SearchModel()
    /** “资产ID”搜索框 */
    readonly searchAssetId = new SearchModel()
    /** “起点”选择（筛选） */
    readonly selectSite = siteHelper.GetIdNameSelectModel()
    /** “终点”选择（筛选） */
    readonly selectTarget = siteHelper.GetIdNameSelectModel()
    /** “终点”选择（表单） */
    readonly selectTargetForm = siteHelper.GetIdNameSelectModel()

    /** 分页器 */
    readonly pagination = new PaginationModel()

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => {
        const transfer = new TransferModel()
        transfer.code = ObjectHelper.GetDateId()
        return transfer
    }

    /** “终点”项目配置 */
    readonly configTarget: FormItemConfig<TransferModel, IdNameModel> = {
        _propName: 'target',
        PropTextEN: 'Target',
        PropTextCH: '终点',
        IsEquired: true,
        Target: this.selectTargetForm.Value,
        _getValue: source => this.selectTargetForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.target)),
        _setValue: (source, propName, value) => source.target = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.target, 0n, Texts.CannotBeEmpty.value)
    }

    /** “资产ID”项目配置 */
    readonly configAssetId: FormItemConfig<TransferModel, string> = {
        _propName: 'assetId',
        PropTextEN: 'Asset ID',
        PropTextCH: '资产ID',
        IsEquired: true,
        Target: ref(),
    }

    /** “编号”项目配置 */
    readonly configCode: FormItemConfig<TransferModel, string> = {
        _propName: 'code',
        PropTextEN: 'Code',
        PropTextCH: '编号',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.code)
    }

    /** “物流公司”项目配置 */
    readonly configLogistics: FormItemConfig<TransferModel, string> = {
        _propName: 'logistics',
        PropTextEN: 'Logistics',
        PropTextCH: '物流公司',
        IsEquired: false,
        Target: ref(),
    }

    /** “司机”项目配置 */
    readonly configDriver: FormItemConfig<TransferModel, string> = {
        _propName: 'driver',
        PropTextEN: 'Driver',
        PropTextCH: '司机',
        IsEquired: false,
        Target: ref(),
    }

    /** “电话”项目配置 */
    readonly configPhone: FormItemConfig<TransferModel, string> = {
        _propName: 'phone',
        PropTextEN: 'Phone',
        PropTextCH: '电话',
        IsEquired: false,
        Target: ref(),
        _isVerifyOk: source => Verify.IsValidPhoneNumber(source.phone)
    }

    /** 表单配置 */
    readonly configForm: FormConfig<TransferModel> = {
        CancelText: Texts.Cancel.value,
        SubmitText: Texts.Ok.value,
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
            await siteHelper.UpdateIdNames()
            await this.selectTargetForm.UpdateItemsAsync()
        },
        _itemConfigs: [
            this.configAssetId,
            this.configCode,
            this.configTarget,
            this.configLogistics,
            this.configDriver,
            this.configPhone,
        ]
    }

    /** 表单模型 */
    readonly form: FormModel<TransferModel> = new FormModel(this.configForm)

    /** 表格模型 */
    readonly table = new TableModel<TransferModel>([
        {
            _propName: 'assetId',
            Text: '资产ID',
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'code',
            Text: '编号',
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'isEnd',
            Text: '状态',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
            _getSource: source => StringHelper.IsNotEmpty(source.endTime),
            _getString: source => IsEnd.ToString(StringHelper.IsNotEmpty(source.endTime)),
        },
        {
            _propName: 'site',
            Text: '起点',
            IsReadonly: true,
            Type: ItemType.TextBox,
            _getStringAsync: source => siteHelper.GetNameAsync(source.site)
        },
        {
            _propName: 'target',
            Text: '终点',
            IsReadonly: true,
            Type: ItemType.TextBox,
            _getStringAsync: source => siteHelper.GetNameAsync(source.target)
        },
        {
            _propName: 'logistics',
            Text: '物流公司',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'driver',
            Text: '司机',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'phone',
            Text: '电话',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'startTime',
            Text: '开始时间',
            IsReadonly: true,
            Type: ItemType.TextBox,
            _getString: source => ObjectHelper.GetDateString(source.startTime)
        },
        {
            _propName: 'endTime',
            Text: '结束时间',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
            _getString: source => ObjectHelper.GetDateString(source.endTime)
        },
    ])
    //#endregion 【Fields】

    //#region 【Properties】
    /** “资产ID”是否只读 */
    readonly IsAssetIdReadonly = ref(false)
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor() {
        this.selectSite.PlaceholderCN.value = 'Origin'
        this.selectSite.PlaceholderCN.value = '起点'
        this.selectTarget.PlaceholderCN.value = 'Target'
        this.selectTarget.PlaceholderCN.value = '终点'

        this.searchCode.PlaceholderCN.value = '编号'
        this.searchCode.PlaceholderEN.value = 'Code'
        this.searchCode._onChange = this.Refresh
        this.searchCode._onSearch = this.Refresh

        this.searchAssetId.PlaceholderCN.value = '资产ID'
        this.searchAssetId.PlaceholderEN.value = 'Asset ID'
        this.searchAssetId._onChange = this.Refresh
        this.searchAssetId._onSearch = this.Refresh

        this.pagination.IsShowSelectedRowCount.value = true
        this.pagination._onChange = this.Refresh
        this.selectSite._onChange = this.Refresh
        this.selectTarget._onChange = this.Refresh

        this.table.IsAllowMultiSelect.value = true
        this.table._initItem = itemModel => {
            IsEnd.InitItemModel(itemModel)
        }
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            await siteHelper.UpdateIdNames()
            await this.selectSite.UpdateItemsAsync()
            await this.selectTarget.UpdateItemsAsync()

            this.pagination.Count.value = await transferHelper.GetCount({
                site: this.selectSite.Value.value?.id,
                target: this.selectTarget.Value.value?.id,
                code: this.searchCode.Value.value,
                assetId: this.searchAssetId.Value.value,
            })
            await transferHelper.GetList({
                pageSize: this.pagination.PageSize.value,
                pageNumber: this.pagination.SelectedNum.value,
                site: this.selectSite.Value.value?.id,
                target: this.selectTarget.Value.value?.id,
                code: this.searchCode.Value.value,
                assetId: this.searchAssetId.Value.value,
            }).then(arr => {
                ArrayHelper.Set(this.table.RowDatas, arr)
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 增 */
    readonly Add = async () => {
        this.form.Title.value = `${Texts.Add.value} ${Texts.Transfer.value}`

        this.form._getSource = this.AddGetSource

        this.form._onSubmitAsync = async source => {
            const res = await transferHelper.Add(source)
            await this.Refresh()
            return GetSubmitResult(res, Texts.AddedSuccessfully.value)
        }

        this.form.Show()
    }

    /** 改 */
    readonly Edit = async () => {
        this.form.Title.value = `${Texts.Edit.value} ${Texts.Transfer.value}`

        this.form._getSource = () => {
            const rowData = this.table.SelectedRowDatas.value[0]

            if (!rowData) {
                console.warn('The rowData is undefined!')
                return new TransferModel()
            }

            return ObjectHelper.ShallowCopy(rowData)
        }

        this.form._onSubmitAsync = async source => {
            const res = await transferHelper.Edit(source)
            await this.Refresh()
            return GetSubmitResult(res, '修改成功')
        }

        this.form.Show()
    }

    /** 删 */
    readonly Delete = async () => {
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

        const rowDatas = this.table.SelectedRowDatas.value.map(i => i.id)
        if (rowDatas.length < 1) {
            console.warn('The model is undefined!')
            return
        }

        transferHelper.DeleteRange(rowDatas).then(res => {
            this.Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
    }
    //#endregion 【Functions】
}
