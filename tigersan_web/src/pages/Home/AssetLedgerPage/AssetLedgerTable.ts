import { Battery, Colors, PopWindowModel, ItemType, ObjectHelper, OnlineState, OnlineStates, PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'
import { AssetModel, AssetState, AssetStates, ErrorType } from '@/models'
import { AssetRecordPageModel } from './AssetRecordPageModel'
import { computed } from 'vue'

// 字段:
export const recordPage = new AssetRecordPageModel()
export const assetDetail = new PopWindowModel()
assetDetail.Title.value = '资产详情'
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
        IsReadonly: true,
        Type: ItemType.Link,
        _onItemClick: itemModel => {
            recordPage._asset = itemModel._rowModel._rowData.id
            recordPage.Refresh()
            assetDetail.Show()
        }
    },
    {
        _propName: 'tagId',
        Text: '标签ID',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
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
    AssetState.InitItemModel(itemModel)

    if (itemModel._headerModel._propName === 'onlineState') {
        if (itemModel.GetSource() === OnlineStates.Online) {
            itemModel.Color.value = Colors.Success
            itemModel.Background.value = Colors.Success10
        } else {
            itemModel.Color.value = Colors.Danger
            itemModel.Background.value = Colors.Danger10
        }
    }

    if (itemModel._headerModel._propName === 'battery') {
        itemModel.Color.value = Battery.GetColor(itemModel.GetSource() as number)
    }
}

/** 是否允许入库 */
export const IsAllowInbound = computed(() =>
    assetLedgerTable.IsSelected.value
    && assetLedgerTable.SelectedRowDatas.value.every(r => r.state === AssetStates.Inbound))
/** 是否允许出库 */
export const IsAllowOutbound = computed(() =>
    assetLedgerTable.IsSelected.value
    && assetLedgerTable.SelectedRowDatas.value.every(r => r.state === AssetStates.InStore || r.state === AssetStates.Stolid))