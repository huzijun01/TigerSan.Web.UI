import { Battery, ItemType, ObjectHelper, OnlineState, PaginationModel, Signal, TableModel } from '@/0_tigersan_ui/tigerui'
import { AssetRecordModel, AssetState } from '@/models'

// 字段:
/** 分页器 */
export const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
export const assetRecordTable = new TableModel<AssetRecordModel>([
    {
        _propName: 'stationName',
        Text: '基站',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'siteName',
        Text: '所在场地',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'fullAddr',
        Text: '所在地址',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'targetSiteName',
        Text: '目标场地',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'fullTarget',
        Text: '目标地址',
        IsReadonly: true,
        IsRequired: false,
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
        _propName: 'battery',
        Text: '电量',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'signal',
        Text: '信号',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'longitude',
        Text: '经度',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'latitude',
        Text: '维度',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'temperature',
        Text: '设备温度',
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
        _propName: 'reportTime',
        Text: '上报时间',
        IsReadonly: true,
        IsRequired: false,
        Type: ItemType.TextBox,
        _getString: source => ObjectHelper.GetDateString(source.reportTime)
    },
])

// 初始化:
assetRecordTable.IsAllowMultiSelect.value = false

assetRecordTable._initItem = itemModel => {
    AssetState.InitItemModel(itemModel)
    OnlineState.InitItemModel(itemModel)
    Battery.InitItemModel(itemModel)
    Signal.InitItemModel(itemModel)
}
