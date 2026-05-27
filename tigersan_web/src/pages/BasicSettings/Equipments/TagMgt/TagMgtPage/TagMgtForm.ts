import { ref, watch } from 'vue'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, SearchModel, BigintHelper, PaginationModel, ArrayHelper, SwitchModel, GetSubmitResult, IdNameModel, IdValueModel, MyActionResult, OnlineStates, IsEnable, OnlineState, loading } from '@/0_tigersan_ui/tigerui'
import { tagMgtTable } from './TagMgtTable'
import { AssetFilter } from '@/pages/Home/AssetLedgerPage/AssetFilter'
import { TagModel, batchHelper, tagHelper, tagTypeHelper, baseStationHelper } from '@/models'

// 字段:
const onlineCount = ref(0)
const offlineCount = ref(0)

// 分页器:
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

// 开关:
const switchIsEnable = new SwitchModel()
switchIsEnable.IsEnable.value = false
watch(tagMgtTable.IsSelected, isSelected => switchIsEnable.IsEnable.value = isSelected)
switchIsEnable._onChange = EditIsEnable

// 选择框:
/** 筛选 */
const { searchRfid } = new AssetFilter(Refresh)
const selectState = OnlineState.GetSelectModel()
const selectIsEnable = IsEnable.GetSelectModel()
const selectBatch = batchHelper.GetIdNameSelectModel()
const selectType = tagTypeHelper.GetIdNameSelectModel()
const selectStation = baseStationHelper.GetIdNameSelectModel()
/** 表单 */
const selectBatchForm = batchHelper.GetIdNameSelectModel()
const selectTypeForm = tagTypeHelper.GetIdNameSelectModel()
// 更新:
tagMgtTable._onSelectStateChange = InitSelectIsEnableState

// 搜索框:
const searchTagId = new SearchModel()
searchTagId.PlaceholderCN.value = '标签ID'
searchTagId.PlaceholderEN.value = 'Tag ID'
searchTagId._onSearch = Refresh
searchTagId._onChange = Refresh

/** “批次”项目配置 */
const configBatch: FormItemConfig<TagModel, IdValueModel> = {
    _propName: 'batch',
    PropText: '批次',
    IsEquired: true,
    Target: selectBatchForm.Value,
    _getValue: source => selectBatchForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.batch)),
    _setValue: (source, propName, value) => source.batch = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.batch, 0n, '不可为空')
}

/** “类型”项目配置 */
const configType: FormItemConfig<TagModel, IdNameModel> = {
    _propName: 'type',
    PropText: '类型',
    IsEquired: true,
    Target: selectTypeForm.Value,
    _getValue: source => selectTypeForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.type)),
    _setValue: (source, propName, value) => source.type = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.type, 0n, '不可为空')
}

/** “标签ID”项目配置 */
const configTagId: FormItemConfig<TagModel, string> = {
    _propName: 'tagId',
    PropText: '标签ID',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.tagId)
}

/** “标牌ID”项目配置 */
const configBrandId: FormItemConfig<TagModel, string> = {
    _propName: 'brandId',
    PropText: '标牌ID',
    IsEquired: false,
    Target: ref(),
}

/** “RFID”项目配置 */
const configRFID: FormItemConfig<TagModel, string> = {
    _propName: 'rfid',
    PropText: 'RFID',
    IsEquired: false,
    Target: ref(),
}

/** “备注”项目配置 */
const configComment: FormItemConfig<TagModel, string> = {
    _propName: 'comment',
    PropText: '备注',
    IsEquired: false,
    Target: ref(),
}

/** “增”源数据获取方法 */
const AddGetSource = () => new TagModel()

/** “标签”表单配置 */
let configTagForm: FormConfig<TagModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        if (isEdit) {
            const rowData = tagMgtTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return
            }

            await selectBatchForm.UpdateItemsAsync()
            selectBatchForm.Value.value = batchHelper.GetIdValue(rowData.batch)
            await selectTypeForm.UpdateItemsAsync()
            selectTypeForm.Value.value = baseStationHelper.GetIdName(rowData.type)
        }
    },
    _itemConfigs: [
        configBatch,
        configType,
        configBrandId,
        configTagId,
        configRFID,
        configComment,
    ]
}

/** “标签”表单模型 */
const tagForm = new FormModel(configTagForm)

async function RefreshBase() {
    InitSelectIsEnableState()

    await batchHelper.UpdateIdValues()
    await selectBatch.UpdateItemsAsync()
    await tagTypeHelper.UpdateIdNames()
    await selectType.UpdateItemsAsync()
    await baseStationHelper.UpdateIdNames()
    await selectStation.UpdateItemsAsync()

    onlineCount.value = await tagHelper.GetCount({
        batch: selectBatch.Value.value?.id,
        type: selectType.Value.value?.id,
        station: selectStation.Value.value?.id,
        isEnable: selectIsEnable.Value.value,
        state: OnlineStates.Online,
        tagId: searchTagId.Value.value,
        rfid: searchRfid.Value.value,
    })
    offlineCount.value = await tagHelper.GetCount({
        batch: selectBatch.Value.value?.id,
        type: selectType.Value.value?.id,
        station: selectStation.Value.value?.id,
        isEnable: selectIsEnable.Value.value,
        state: OnlineStates.Offline,
        tagId: searchTagId.Value.value,
        rfid: searchRfid.Value.value,
    })
    pagination.Count.value = await tagHelper.GetCount({
        batch: selectBatch.Value.value?.id,
        type: selectType.Value.value?.id,
        station: selectStation.Value.value?.id,
        isEnable: selectIsEnable.Value.value,
        state: selectState.Value.value,
        tagId: searchTagId.Value.value,
        rfid: searchRfid.Value.value,
    })
}

/** 更新“行数据” */
async function UpdateRowDatas() {
    await RefreshBase()

    await tagHelper.GetList({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
        batch: selectBatch.Value.value?.id,
        station: selectStation.Value.value?.id,
        isEnable: selectIsEnable.Value.value,
        state: selectState.Value.value,
        type: selectType.Value.value?.id,
        tagId: searchTagId.Value.value,
        rfid: searchRfid.Value.value,
    }).then(arr => {
        tagMgtTable.UpdateRowDatas(arr, (r, n) => BigintHelper.IsEqualAndNotUndefined(r.id, n.id))
    })
}

/** 查 */
async function Refresh() {
    try {
        loading.IsShow.value = true

        await RefreshBase()

        await tagHelper.GetList({
            pageSize: pagination.PageSize.value,
            pageNumber: pagination.SelectedNum.value,
            batch: selectBatch.Value.value?.id,
            station: selectStation.Value.value?.id,
            isEnable: selectIsEnable.Value.value,
            state: selectState.Value.value,
            type: selectType.Value.value?.id,
            tagId: searchTagId.Value.value,
            rfid: searchRfid.Value.value,
        }).then(arr => {
            ArrayHelper.Set(tagMgtTable.RowDatas, arr)
        })
    } finally {
        loading.IsShow.value = false
    }
}

pagination._onChange = Refresh
selectBatch._onChange = Refresh
selectStation._onChange = Refresh
selectType._onChange = Refresh
selectState._onChange = Refresh
selectIsEnable._onChange = Refresh

/** 增 */
function Add() {
    tagForm.Title.value = '新增标签'

    tagForm._getSource = AddGetSource

    tagForm._onSubmitAsync = async source => {
        const res = await tagHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    tagForm.Show()
}

/** 改 */
function Edit() {
    tagForm.Title.value = '修改标签'

    tagForm._getSource = () => {
        const rowData = tagMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new TagModel()
        }

        return ObjectHelper.ShallowCopy(rowData)
    }

    tagForm._onSubmitAsync = async source => {
        const res = await tagHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    tagForm.Show(true)
}

/** 改 */
function EditIsEnable(isEnable: boolean) {
    if (!tagMgtTable.IsSelected.value) return

    dialog.ShowDialog(
        '修改启用状态',
        isEnable ? '是否启用' : '是否禁用',
        undefined,
        (state) => {
            if (state != DialogState.Yes) {
                InitSelectIsEnableState()
                return
            }

            const rowDatas: TagModel[] = []
            tagMgtTable.SelectedRowDatas.value.forEach(rowData => {
                const newRowData = ObjectHelper.ShallowCopy(rowData)
                newRowData.isEnable = isEnable
                rowDatas.push(newRowData)
            })

            tagHelper.EditRange(rowDatas).then(res => {
                Refresh().then(InitSelectIsEnableState)
                MyActionResult.ShowResult(res)
            })
        },
        DialogMode.YesOrNo,
        Colors.Warning)
}

function InitSelectIsEnableState() {
    switchIsEnable.Value.value = tagMgtTable.IsSelected.value && tagMgtTable.SelectedRowDatas.value.every(r => r.isEnable)
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

    const rowData = tagMgtTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    try {
        loading.IsShow.value = true

        await tagHelper.Delete(rowData.id).then(res => {
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

export const tagMgtForm = {
    pagination,
    onlineCount,
    offlineCount,
    searchTagId,
    switchIsEnable,
    searchRfid,
    selectState,
    selectIsEnable,
    selectBatch,
    selectStation,
    selectType,
    selectBatchForm,
    selectTypeForm,
    configBatch,
    configType,
    configBrandId,
    configTagId,
    configRFID,
    configComment,
    tagForm,
    Refresh,
    UpdateRowDatas,
    Add,
    Edit,
    EditIsEnable,
    Delete,
    Repair,
}