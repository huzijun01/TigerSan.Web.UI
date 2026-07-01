import { computed, ref, watch } from 'vue'
import { Colors, DialogHelper, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, SearchModel, BigintHelper, PaginationModel, ArrayHelper, SwitchModel, GetSubmitResult, IdNameModel, IdValueModel, MyActionResult, OnlineStates, IsEnable, OnlineState, loading, Texts, StringHelper, IsFall } from '@/0_tigersan_ui/tigerui'
import { GetTagTable } from './TagMgtTable'
import { AssetFilter } from '@/pages/Home/AssetLedgerPage/AssetFilter'
import { AssetFormModel } from '@/pages/Home/AssetLedgerPage/AssetFormModel'
import { TagModel, batchHelper, tagHelper, tagTypeHelper, baseStationHelper, EqpTypes, EqpType, companyHelper, assetHelper, AssetHelper } from '@/models'

export class TagMgtPageModel {
    //#region 【Fields】
    /** 设备类型 */
    readonly eqpType: EqpTypes
    /** 设备类型 */
    readonly eqpTypeName: string
    /** 在线总数 */
    readonly OnlineCount = ref(0)
    /** 离线总数 */
    readonly OfflineCount = ref(0)
    /** 表格 */
    readonly table = GetTagTable()
    /** 分页器 */
    readonly pagination = new PaginationModel()
    /** 开关 */
    readonly switchIsEnable = new SwitchModel()
    /** 资产表单 */
    readonly assetForm = new AssetFormModel()

    // 选择框:
    /** 筛选 */
    readonly searchRfid: SearchModel
    readonly selectCompany = companyHelper.GetIdNameSelectModel()
    readonly selectOnlineState = OnlineState.GetSelectModel()
    readonly selectIsFall = IsFall.GetSelectModel()
    readonly selectIsEnable = IsEnable.GetSelectModel()
    readonly selectBatch = batchHelper.GetIdNameSelectModel()
    readonly selectTagType = tagTypeHelper.GetIdNameSelectModel()
    readonly selectStation = baseStationHelper.GetIdNameSelectModel()
    /** 表单 */
    readonly selectBatchForm = batchHelper.GetIdNameSelectModel()
    readonly selectTagTypeForm = tagTypeHelper.GetIdNameSelectModel()

    // 搜索框:
    readonly searchTagId = new SearchModel()

    /** “批次”项目配置 */
    readonly configBatch: FormItemConfig<TagModel, IdValueModel> = {
        _propName: 'batch',
        PropTextEN: 'Batch',
        PropTextCH: '批次',
        IsEquired: true,
        Target: this.selectBatchForm.Value,
        _getValue: source => this.selectBatchForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.batch)),
        _setValue: (source, propName, value) => source.batch = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.batch, 0n, Texts.CannotBeEmpty.value)
    }

    /** “类型”项目配置 */
    readonly configType: FormItemConfig<TagModel, IdNameModel> = {
        _propName: 'type',
        PropTextEN: 'Type',
        PropTextCH: '类型',
        IsEquired: true,
        Target: this.selectTagTypeForm.Value,
        _getValue: source => this.selectTagTypeForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.type)),
        _setValue: (source, propName, value) => source.type = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.type, 0n, Texts.CannotBeEmpty.value)
    }

    /** “标签ID”项目配置 */
    readonly configTagId: FormItemConfig<TagModel, string> = {
        _propName: 'tagId',
        PropTextEN: 'TagId',
        PropTextCH: '标签ID',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.tagId)
    }

    /** “资产ID”项目配置 */
    readonly configAssetId: FormItemConfig<TagModel, string> = {
        _propName: 'assetId',
        PropTextEN: 'AssetId',
        PropTextCH: '资产ID',
        IsEquired: false,
        Target: ref(),
    }

    /** “RFID”项目配置 */
    readonly configRFID: FormItemConfig<TagModel, string> = {
        _propName: 'rfid',
        PropTextEN: 'RFID',
        PropTextCH: 'RFID',
        IsEquired: false,
        Target: ref(),
    }

    /** “备注”项目配置 */
    readonly configComment: FormItemConfig<TagModel, string> = {
        _propName: 'comment',
        PropTextEN: 'Comment',
        PropTextCH: '备注',
        IsEquired: false,
        Target: ref(),
    }

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => {
        const tag = new TagModel()
        tag.eqpType = this.eqpType
        return tag
    }

    /** “标签”表单配置 */
    readonly configTagForm: FormConfig<TagModel> = {
        CancelText: Texts.Cancel.value,
        SubmitText: Texts.Ok.value,
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
            if (isEdit) {
                const rowData = this.table.SelectedRowDatas.value[0]
                if (!rowData) {
                    console.warn('The rowData is undefined!')
                    return
                }

                await this.selectBatchForm.UpdateItemsAsync()
                this.selectBatchForm.Value.value = batchHelper.GetIdValue(rowData.batch)
                await this.selectTagTypeForm.UpdateItemsAsync()
                this.selectTagTypeForm.Value.value = baseStationHelper.GetIdName(rowData.type)
            }
        },
        _itemConfigs: [
            this.configBatch,
            this.configType,
            this.configAssetId,
            this.configTagId,
            this.configRFID,
            this.configComment,
        ]
    }

    /** “标签”表单模型 */
    readonly tagForm = new FormModel(this.configTagForm)
    //#endregion 【Fields】

    //#region 【Properties】
    readonly IsAllowBinding = computed(() => {
        const rowData = this.table.SelectedRowDatas.value[0]
        return rowData && !StringHelper.IsNotEmpty(rowData.assetId)
    })
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(eqpType: EqpTypes) {
        this.eqpType = eqpType
        this.eqpTypeName = EqpType.GetName(eqpType)
        watch(this.table.IsSelected, isSelected => this.switchIsEnable.IsEnable.value = isSelected)
        this.searchRfid = new AssetFilter(this.Refresh).searchRfid
        this.pagination.IsShowSelectedRowCount.value = true
        this.switchIsEnable.IsEnable.value = false
        this.switchIsEnable._onChange = this.EditIsEnable
        this.searchTagId.PlaceholderCN.value = '标签ID'
        this.searchTagId.PlaceholderEN.value = 'Tag ID'
        this.assetForm.IsCompanyEnable = false
        this.assetForm.IsTagIdEnable.value = false

        // 更新:
        this.table._onSelectStateChange = this.InitSelectIsEnableState
        this.searchTagId._onSearch = this.Refresh
        this.searchTagId._onChange = this.Refresh
        this.pagination._onChange = this.Refresh
        this.selectCompany._onChange = this.Refresh
        this.selectBatch._onChange = this.Refresh
        this.selectStation._onChange = this.Refresh
        this.selectTagType._onChange = this.Refresh
        this.selectOnlineState._onChange = this.Refresh
        this.selectIsFall._onChange = this.Refresh
        this.selectIsEnable._onChange = this.Refresh
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    readonly RefreshBase = async () => {
        this.InitSelectIsEnableState()

        await companyHelper.UpdateIdNames()
        await batchHelper.UpdateIdValues()
        await this.selectBatch.UpdateItemsAsync()
        await tagTypeHelper.UpdateIdNames()
        await this.selectTagType.UpdateItemsAsync()
        await baseStationHelper.UpdateIdNames()
        await this.selectStation.UpdateItemsAsync()

        this.OnlineCount.value = await tagHelper.GetCount({
            company: this.selectCompany.Value.value?.id,
            batch: this.selectBatch.Value.value?.id,
            type: this.selectTagType.Value.value?.id,
            station: this.selectStation.Value.value?.id,
            eqpType: this.eqpType,
            isEnable: this.selectIsEnable.Value.value,
            state: OnlineStates.Online,
            isFall: this.selectIsFall.Value.value,
            tagId: this.searchTagId.Value.value,
            rfid: this.searchRfid.Value.value,
        })
        this.OfflineCount.value = await tagHelper.GetCount({
            company: this.selectCompany.Value.value?.id,
            batch: this.selectBatch.Value.value?.id,
            type: this.selectTagType.Value.value?.id,
            station: this.selectStation.Value.value?.id,
            eqpType: this.eqpType,
            isEnable: this.selectIsEnable.Value.value,
            state: OnlineStates.Offline,
            isFall: this.selectIsFall.Value.value,
            tagId: this.searchTagId.Value.value,
            rfid: this.searchRfid.Value.value,
        })
        this.pagination.Count.value = await tagHelper.GetCount({
            company: this.selectCompany.Value.value?.id,
            batch: this.selectBatch.Value.value?.id,
            type: this.selectTagType.Value.value?.id,
            station: this.selectStation.Value.value?.id,
            eqpType: this.eqpType,
            isEnable: this.selectIsEnable.Value.value,
            isFall: this.selectIsFall.Value.value,
            state: this.selectOnlineState.Value.value,
            tagId: this.searchTagId.Value.value,
            rfid: this.searchRfid.Value.value,
        })
    }

    /** 更新“行数据” */
    readonly UpdateRowDatas = async () => {
        await this.RefreshBase()

        await tagHelper.GetList({
            pageSize: this.pagination.PageSize.value,
            pageNumber: this.pagination.SelectedNum.value,
            company: this.selectCompany.Value.value?.id,
            batch: this.selectBatch.Value.value?.id,
            station: this.selectStation.Value.value?.id,
            eqpType: this.eqpType,
            isEnable: this.selectIsEnable.Value.value,
            state: this.selectOnlineState.Value.value,
            type: this.selectTagType.Value.value?.id,
            tagId: this.searchTagId.Value.value,
            rfid: this.searchRfid.Value.value,
        }).then(arr => {
            this.table.UpdateRowDatas(arr, (r, n) => BigintHelper.IsEqualAndNotUndefined(r.id, n.id))
        })
    }

    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            await this.RefreshBase()

            await tagHelper.GetList({
                pageSize: this.pagination.PageSize.value,
                pageNumber: this.pagination.SelectedNum.value,
                company: this.selectCompany.Value.value?.id,
                batch: this.selectBatch.Value.value?.id,
                station: this.selectStation.Value.value?.id,
                eqpType: this.eqpType,
                isEnable: this.selectIsEnable.Value.value,
                state: this.selectOnlineState.Value.value,
                isFall: this.selectIsFall.Value.value,
                type: this.selectTagType.Value.value?.id,
                tagId: this.searchTagId.Value.value,
                rfid: this.searchRfid.Value.value,
            }).then(arr => {
                ArrayHelper.Set(this.table.RowDatas, arr)
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 增 */
    readonly Add = () => {
        this.tagForm.Title.value = `${Texts.Add.value}${this.eqpTypeName}`

        this.tagForm._getSource = this.AddGetSource

        this.tagForm._onSubmitAsync = async source => {
            const res = await tagHelper.Add(source)
            await this.Refresh()
            return GetSubmitResult(res, Texts.AddedSuccessfully.value)
        }

        this.tagForm.Show()
    }

    /** 改 */
    readonly Edit = () => {
        this.tagForm.Title.value = `${Texts.Edit.value}${this.eqpTypeName}`

        this.tagForm._getSource = () => {
            const rowData = this.table.SelectedRowDatas.value[0]

            if (!rowData) {
                console.warn('The rowData is undefined!')
                return new TagModel()
            }

            return ObjectHelper.ShallowCopy(rowData)
        }

        this.tagForm._onSubmitAsync = async source => {
            const res = await tagHelper.Edit(source)
            await this.Refresh()
            return GetSubmitResult(res, '修改成功')
        }

        this.tagForm.Show(true)
    }

    readonly EditIsEnable = (isEnable: boolean) => {
        if (!this.table.IsSelected.value) return

        DialogHelper.ShowDialog(
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

                    const rowDatas: TagModel[] = []
                    this.table.SelectedRowDatas.value.forEach(rowData => {
                        const newRowData = ObjectHelper.ShallowCopy(rowData)
                        newRowData.isEnable = isEnable
                        rowDatas.push(newRowData)
                    })

                    const res = await tagHelper.EditRange(rowDatas)
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
        this.switchIsEnable.Value.value = this.table.IsSelected.value && this.table.SelectedRowDatas.value.every(r => r.isEnable)
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

        const rowData = this.table.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return
        }

        try {
            loading.IsShow.value = true

            await tagHelper.Delete(rowData.id).then(res => {
                this.Refresh()
                MyActionResult.ShowResult(res, '删除成功')
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 增 */
    readonly Binding = async () => {
        const rowData = this.table.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new TagModel()
        }
        const tag = ObjectHelper.ShallowCopy(rowData)

        if (StringHelper.IsNotEmpty(tag.assetId)) return

        this.assetForm.assetForm.Title.value = `${Texts.Binding.value}${Texts.Asset.value}`

        this.assetForm.assetForm._getSource = () => {
            const source = this.assetForm.AddGetSource()
            source.company = tag.company ?? 0n
            source.tagId = tag.tagId
            source.assetId = ObjectHelper.GetDateId()
            return source
        }

        this.assetForm.assetForm._onSubmitAsync = async source => {
            const res = await assetHelper.Add(source)
            await this.Refresh()
            return GetSubmitResult(res, '绑定成功')
        }

        this.assetForm.assetForm.Show()
    }

    readonly Repair = () => {
        DialogHelper.ShowInformation('维修')
    }
    //#endregion 【Functions】
}