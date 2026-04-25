import { Battery, Colors, ItemType, ObjectHelper, OnlineState, OnlineStates, PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'
import { AssetRecordModel, AssetState } from '@/models'

// 字段:
/** 分页器 */
export const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
export const assetRecordTable = new TableModel<AssetRecordModel>([
    {
        _propName: 'siteName',
        Text: '所在场地',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'stationName',
        Text: '基站',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'addr',
        Text: '地址',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'addrDetail',
        Text: '详细地址',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'targetSiteName',
        Text: '目标场地',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'targetAddr',
        Text: '目标地址',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'targetAddrDetail',
        Text: '目标详址',
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
        _propName: 'battery',
        Text: '电量',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'signal',
        Text: '信号',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'longitude',
        Text: '经度',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'latitude',
        Text: '维度',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'temperature',
        Text: '设备温度',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'comment',
        Text: '备注',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'reportTime',
        Text: '上报时间',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: source => ObjectHelper.GetDateString(source.reportTime)
    },
])

// 初始化:
assetRecordTable.IsAllowMultiSelect.value = false

assetRecordTable._initItem = itemModel => {
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
