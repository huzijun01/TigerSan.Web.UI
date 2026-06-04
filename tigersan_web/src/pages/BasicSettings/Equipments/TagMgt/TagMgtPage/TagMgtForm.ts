import { ref, watch } from 'vue'
import { Colors, DialogHelper, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, SearchModel, BigintHelper, PaginationModel, ArrayHelper, SwitchModel, GetSubmitResult, IdNameModel, IdValueModel, MyActionResult, OnlineStates, IsEnable, OnlineState, loading, Texts } from '@/0_tigersan_ui/tigerui'
import { GetTable } from './TagMgtTable'
import { AssetFilter } from '@/pages/Home/AssetLedgerPage/AssetFilter'
import { TagModel, batchHelper, tagHelper, tagTypeHelper, baseStationHelper, EqpTypes, EqpType } from '@/models'

export class TagMgtForm {
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
    readonly table = GetTable()
    /** 分页器 */
    readonly pagination = new PaginationModel()
    /** 开关 */
    readonly switchIsEnable = new SwitchModel()

    // 选择框:
    /** 筛选 */
    readonly searchRfid: SearchModel
    readonly selectState = OnlineState.GetSelectModel()
    readonly selectIsEnable = IsEnable.GetSelectModel()
    readonly selectBatch = batchHelper.GetIdNameSelectModel()
    readonly selectType = tagTypeHelper.GetIdNameSelectModel()
    readonly selectStation = baseStationHelper.GetIdNameSelectModel()
    /** 表单 */
    readonly selectBatchForm = batchHelper.GetIdNameSelectModel()
    readonly selectTypeForm = tagTypeHelper.GetIdNameSelectModel()

    // 搜索框:
    readonly searchTagId = new SearchModel()

    /** “批次”项目配置 */
    readonly configBatch: FormItemConfig<TagModel, IdValueModel> = {
        _propName: 'batch',
        PropText: '批次',
        IsEquired: true,
        Target: this.selectBatchForm.Value,
        _getValue: source => this.selectBatchForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.batch)),
        _setValue: (source, propName, value) => source.batch = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.batch, 0n, '不可为空')
    }

    /** “类型”项目配置 */
    readonly configType: FormItemConfig<TagModel, IdNameModel> = {
        _propName: 'type',
        PropText: '类型',
        IsEquired: true,
        Target: this.selectTypeForm.Value,
        _getValue: source => this.selectTypeForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.type)),
        _setValue: (source, propName, value) => source.type = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.type, 0n, '不可为空')
    }

    /** “标签ID”项目配置 */
    readonly configTagId: FormItemConfig<TagModel, string> = {
        _propName: 'tagId',
        PropText: '标签ID',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.tagId)
    }

    /** “标牌ID”项目配置 */
    readonly configBrandId: FormItemConfig<TagModel, string> = {
        _propName: 'brandId',
        PropText: '标牌ID',
        IsEquired: false,
        Target: ref(),
    }

    /** “RFID”项目配置 */
    readonly configRFID: FormItemConfig<TagModel, string> = {
        _propName: 'rfid',
        PropText: 'RFID',
        IsEquired: false,
        Target: ref(),
    }

    /** “备注”项目配置 */
    readonly configComment: FormItemConfig<TagModel, string> = {
        _propName: 'comment',
        PropText: '备注',
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
        CancelText: '取消',
        SubmitText: '确定',
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
                await this.selectTypeForm.UpdateItemsAsync()
                this.selectTypeForm.Value.value = baseStationHelper.GetIdName(rowData.type)
            }
        },
        _itemConfigs: [
            this.configBatch,
            this.configType,
            this.configBrandId,
            this.configTagId,
            this.configRFID,
            this.configComment,
        ]
    }

    /** “标签”表单模型 */
    readonly tagForm = new FormModel(this.configTagForm)
    //#endregion 【Fields】

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

        // 更新:
        this.table._onSelectStateChange = this.InitSelectIsEnableState
        this.searchTagId._onSearch = this.Refresh
        this.searchTagId._onChange = this.Refresh
        this.pagination._onChange = this.Refresh
        this.selectBatch._onChange = this.Refresh
        this.selectStation._onChange = this.Refresh
        this.selectType._onChange = this.Refresh
        this.selectState._onChange = this.Refresh
        this.selectIsEnable._onChange = this.Refresh
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    readonly RefreshBase = async () => {
        this.InitSelectIsEnableState()

        await batchHelper.UpdateIdValues()
        await this.selectBatch.UpdateItemsAsync()
        await tagTypeHelper.UpdateIdNames()
        await this.selectType.UpdateItemsAsync()
        await baseStationHelper.UpdateIdNames()
        await this.selectStation.UpdateItemsAsync()

        this.OnlineCount.value = await tagHelper.GetCount({
            batch: this.selectBatch.Value.value?.id,
            type: this.selectType.Value.value?.id,
            station: this.selectStation.Value.value?.id,
            eqpType: this.eqpType,
            isEnable: this.selectIsEnable.Value.value,
            state: OnlineStates.Online,
            tagId: this.searchTagId.Value.value,
            rfid: this.searchRfid.Value.value,
        })
        this.OfflineCount.value = await tagHelper.GetCount({
            batch: this.selectBatch.Value.value?.id,
            type: this.selectType.Value.value?.id,
            station: this.selectStation.Value.value?.id,
            eqpType: this.eqpType,
            isEnable: this.selectIsEnable.Value.value,
            state: OnlineStates.Offline,
            tagId: this.searchTagId.Value.value,
            rfid: this.searchRfid.Value.value,
        })
        this.pagination.Count.value = await tagHelper.GetCount({
            batch: this.selectBatch.Value.value?.id,
            type: this.selectType.Value.value?.id,
            station: this.selectStation.Value.value?.id,
            eqpType: this.eqpType,
            isEnable: this.selectIsEnable.Value.value,
            state: this.selectState.Value.value,
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
            batch: this.selectBatch.Value.value?.id,
            station: this.selectStation.Value.value?.id,
            eqpType: this.eqpType,
            isEnable: this.selectIsEnable.Value.value,
            state: this.selectState.Value.value,
            type: this.selectType.Value.value?.id,
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
                batch: this.selectBatch.Value.value?.id,
                station: this.selectStation.Value.value?.id,
                eqpType: this.eqpType,
                isEnable: this.selectIsEnable.Value.value,
                state: this.selectState.Value.value,
                type: this.selectType.Value.value?.id,
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
            return GetSubmitResult(res, '添加成功')
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
            (state) => {
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

                tagHelper.EditRange(rowDatas).then(res => {
                    this.Refresh().then(this.InitSelectIsEnableState)
                    MyActionResult.ShowResult(res)
                })
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
            return {}
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

    readonly Repair = () => {
        DialogHelper.ShowInformation('维修')
    }
    //#endregion 【Functions】
}