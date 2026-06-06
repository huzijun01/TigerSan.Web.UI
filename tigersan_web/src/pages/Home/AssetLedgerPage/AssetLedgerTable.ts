import AssetPathPage from './AssetPathPage/AssetPathPage.vue'
import AssetRecordPage from './AssetRecordPage/AssetRecordPage.vue'
import { computed, ref } from 'vue'
import { Battery, PopWindowModel, ItemType, ObjectHelper, OnlineState, PaginationModel, TableModel, ColumnSelectModel, TabViewModel, StringHelper, Texts } from '@/0_tigersan_ui/tigerui'
import { AssetPathPageModel } from './AssetPathPage/AssetPathPageModel'
import { AssetRecordPageModel } from './AssetRecordPage/AssetRecordPageModel'
import { AssetModel, AssetState, AssetStates, BindingState, ErrorType, tagTypeHelper } from '@/models'

// 字段:
/** 记录页 */
export const recordPage = new AssetRecordPageModel()
/** 轨迹页 */
export const pathPage = new AssetPathPageModel()
/** 标签视图 */
export const tabView = new TabViewModel([
    {
        Title: '轨迹',
        _component: AssetPathPage,
        _rootProps: { model: pathPage },
    },
    {
        Title: '记录',
        _component: AssetRecordPage,
        _rootProps: { model: recordPage },
    }
])

// 弹窗:
/** 资产详情 */
export const assetDetail = new PopWindowModel()
assetDetail.MinWidth.value = '80vw'
assetDetail.MinHeight.value = '70vh'
assetDetail._onShow = () => tabView.SelectedPage.value = tabView.Pages[0]
/** 标签详情 */
export const tagDetail = new PopWindowModel()
export const TagId = ref<string | undefined>()

/** 分页器 */
export const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
export const assetLedgerTable = new TableModel<AssetModel>([
    {
        _propName: 'companyName',
        Text: '公司',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'departmentName',
        Text: '部门',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'assetId',
        Text: '资产ID',
        IsFreeze: true,
        IsReadonly: true,
        Type: ItemType.Link,
        _onItemClick: itemModel => {
            const rowData = itemModel._rowModel._rowData
            recordPage._asset = rowData.id
            pathPage._asset = rowData.id
            assetDetail.Title.value = `${Texts.AssetDetail.value} - ${rowData.assetId}`
            recordPage.Refresh()
            const weekRange = ObjectHelper.GetOneWeekAgoAndTodayString()
            pathPage.date.Date.value = [weekRange.start, weekRange.end]
            pathPage.Refresh()
            assetDetail.Show()
        }
    },
    {
        _propName: 'tagId',
        Text: '标签ID',
        IsFreeze: true,
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.Link,
        _onItemClickAsync: async itemModel => {
            const rowData = itemModel._rowModel._rowData
            tagDetail.Title.value = `${Texts.TagDetail.value} - ${rowData.assetId}`
            TagId.value = rowData.tagId
            tagDetail.Show()
        }
    },
    {
        _propName: 'isBound',
        Text: '绑定状态',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
        _getSource: source => StringHelper.IsNotEmpty(source.tagId),
        _getString: source => BindingState.GetName(StringHelper.IsNotEmpty(source.tagId))
    },
    {
        _propName: 'tagType',
        Text: '标签类型',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => tagTypeHelper.GetNameAsync(source.tagType)
    },
    {
        _propName: 'siteName',
        Text: '场地',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'typeName',
        Text: '类型',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'state',
        Text: '状态',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: source => AssetState.GetName(source.state)
    },
    {
        _propName: 'onlineState',
        Text: '在线状态',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: OnlineState.GetString,
    },
    {
        _propName: 'errorType',
        Text: '异常类型',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
        _getString: source => ErrorType.GetName(source.errorType)
    },
    {
        _propName: 'battery',
        Text: '标签电量',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'rfid',
        Text: 'RFID',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'comment',
        Text: '备注',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'bindingTime',
        Text: '绑定时间',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
        _getString: source => ObjectHelper.GetDateString(source.bindingTime)
    },
    {
        _propName: 'calculationTime',
        Text: '计算时间',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
        _getString: source => ObjectHelper.GetDateString(source.calculationTime)
    },
    {
        _propName: 'dailyMove',
        Text: '日周转',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'monthlyMove',
        Text: '月周转',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'totalMove',
        Text: '总周转',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'stayDuration',
        Text: '在库时长（时）',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'travelDuration',
        Text: '在途时长（时）',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'offlineDuration',
        Text: '离线时长（时）',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
])

// 初始化:
assetLedgerTable.IsAllowMultiSelect.value = true

assetLedgerTable._initItem = itemModel => {
    Battery.InitItemModel(itemModel)
    AssetState.InitItemModel(itemModel)
    OnlineState.InitItemModel(itemModel)
    BindingState.InitItemModel(itemModel)
}

/** 是否允许入库 */
export const IsAllowInbound = computed(() =>
    assetLedgerTable.IsSelected.value
    && assetLedgerTable.SelectedRowDatas.value.every(r => r.state === AssetStates.Inbound))
/** 是否允许出库 */
export const IsAllowOutbound = computed(() =>
    assetLedgerTable.IsSelected.value
    && assetLedgerTable.SelectedRowDatas.value.every(r => r.state === AssetStates.InStore || r.state === AssetStates.Stolid))

/** “列筛选”选择器类型 */
export const selectColumnFilter = new ColumnSelectModel(assetLedgerTable, 'assetLedgerTable_Columns')
