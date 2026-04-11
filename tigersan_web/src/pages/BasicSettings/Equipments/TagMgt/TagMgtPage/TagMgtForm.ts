import { ref, watch } from 'vue'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, SearchModel, SelectModel, BigintHelper, PaginationModel, ArrayHelper, SwitchModel, GetSubmitResult, IdNameModel, IdValueModel, IsEnable2String, MyActionResult, OnlineState, OnlineState2String } from '@/0_tigersan_ui/tigerui'
import { TagModel, tagMgtTable } from './TagMgtTable'
import { batchMgtHelper, tagTypeMgtHelper, baseStationMgtHelper, tagMgtHelper } from '@/models'

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
const selectBatch = batchMgtHelper.GetIdNameSelectModel()
const selectType = tagTypeMgtHelper.GetIdNameSelectModel()
const selectStation = baseStationMgtHelper.GetIdNameSelectModel()
/** 表单 */
const selectBatchForm = batchMgtHelper.GetIdNameSelectModel()
const selectTypeForm = tagTypeMgtHelper.GetIdNameSelectModel()

const searchTagId = new SearchModel()
searchTagId.PlaceholderCN.value = '请输入标签ID'
searchTagId.PlaceholderEN.value = 'Please enter the MAC'
searchTagId._onSearch = Refresh
searchTagId._onChange = Refresh

const selectState = new SelectModel<OnlineState>()
selectState.Width.value = 120
selectState.Value.value = undefined
selectState.IsAllowSearch.value = true
selectState.PlaceholderCN.value = '在线状态'
selectState.PlaceholderEN.value = 'OnlineState'
selectState.Items.push(...[OnlineState.Online, OnlineState.Offline])
selectState._converter = OnlineState2String

const selectIsEnable = new SelectModel<boolean>()
selectIsEnable.Width.value = 120
selectIsEnable.Value.value = undefined
selectIsEnable.IsAllowSearch.value = true
selectIsEnable.PlaceholderCN.value = '激活状态'
selectIsEnable.PlaceholderEN.value = 'IsEnable'
selectIsEnable.Items.push(...[true, false])
selectIsEnable._converter = IsEnable2String
tagMgtTable._onSelectStateChange = InitSelectIsEnableState

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

/** “备注”项目配置 */
const configComment: FormItemConfig<TagModel, string> = {
    _propName: 'comment',
    PropText: '备注',
    IsEquired: false,
    Target: ref(),
}

/** “增”源数据获取方法 */
const AddGetSource = () => new TagModel()

/** “基站管理”表单配置 */
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
            selectBatchForm.Value.value = batchMgtHelper.GetIdValue(rowData.batch)
            await selectTypeForm.UpdateItemsAsync()
            selectTypeForm.Value.value = baseStationMgtHelper.GetIdName(rowData.type)
        }
    },
    _itemConfigs: [
        configBatch,
        configType,
        configBrandId,
        configTagId,
        configComment,
    ]
}

/** “基站管理”表单模型 */
const tagForm = new FormModel(configTagForm)

/** 查 */
async function Refresh() {
    InitSelectIsEnableState()

    await batchMgtHelper.UpdateIdValues()
    await selectBatch.UpdateItemsAsync()
    await tagTypeMgtHelper.UpdateIdNames()
    await selectType.UpdateItemsAsync()
    await baseStationMgtHelper.UpdateIdNames()
    await selectStation.UpdateItemsAsync()

    onlineCount.value = await tagMgtHelper.GetCount({
        batch: selectBatch.Value.value?.id,
        type: selectType.Value.value?.id,
        station: selectStation.Value.value?.id,
        isEnable: selectIsEnable.Value.value,
        state: OnlineState.Online,
        tagId: searchTagId.Value.value,
    })
    pagination.Count.value = await tagMgtHelper.GetCount({
        batch: selectBatch.Value.value?.id,
        type: selectType.Value.value?.id,
        station: selectStation.Value.value?.id,
        isEnable: selectIsEnable.Value.value,
        state: selectState.Value.value,
        tagId: searchTagId.Value.value,
    })
    offlineCount.value = pagination.Count.value - onlineCount.value
    await tagMgtHelper.GetList({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
        batch: selectBatch.Value.value?.id,
        station: selectStation.Value.value?.id,
        isEnable: selectIsEnable.Value.value,
        state: selectState.Value.value,
        type: selectType.Value.value?.id,
        tagId: searchTagId.Value.value,
    }).then(arr => {
        ArrayHelper.Set(tagMgtTable.RowDatas, arr)
    })
}

pagination._onChange = Refresh
selectBatch._onChange = Refresh
selectStation._onChange = Refresh
selectType._onChange = Refresh
selectState._onChange = Refresh
selectIsEnable._onChange = Refresh

/** 增 */
function Add() {
    tagForm.Title.value = '新增基站'

    tagForm._getSource = AddGetSource

    tagForm._onSubmitAsync = async source => {
        const res = await tagMgtHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    tagForm.Show()
}

/** 改 */
function Edit() {
    tagForm.Title.value = '修改基站'

    tagForm._getSource = () => {
        const rowData = tagMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new TagModel()
        }

        return ObjectHelper.ShallowCopy(rowData)
    }

    tagForm._onSubmitAsync = async source => {
        const res = await tagMgtHelper.Edit(source)
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

            tagMgtHelper.EditRange(rowDatas).then(res => {
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

function DeleteRowData(state: DialogState) {
    if (state != DialogState.Yes) return

    const rowData = tagMgtTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    tagMgtHelper.Delete(rowData.id)
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
    searchTagId,
    switchIsEnable,
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
    configComment,
    tagForm,
    Refresh,
    Add,
    Edit,
    EditIsEnable,
    Delete,
    Repair,
}