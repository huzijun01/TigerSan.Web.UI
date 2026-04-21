import { Battery, Colors, PopWindowModel, ItemType, ObjectHelper, OnlineState, OnlineStates, PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'
import { AssetRecordModel, AssetState, AssetStates } from '@/models'

// 字段:
/** 分页器 */
export const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
export const assetRecordTable = new TableModel<AssetRecordModel>([
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
    if (itemModel._headerModel._propName === 'state') {
        const source = itemModel.GetSource()
        if (source === AssetStates.InTransit) {
            itemModel.Color.value = Colors.Success
            itemModel.Background.value = Colors.Success10
        } else if (source === AssetStates.Stolid) {
            itemModel.Color.value = Colors.Warning
            itemModel.Background.value = Colors.Warning10
        } else if (source === AssetStates.Outbound) {
            itemModel.Color.value = Colors.Info
            itemModel.Background.value = Colors.Info10
        } else if (source === AssetStates.NoRecord) {
            itemModel.Color.value = Colors.Danger
            itemModel.Background.value = Colors.Danger10
        } else {
            itemModel.Color.value = Colors.Brand
            itemModel.Background.value = Colors.Brand10
        }
    }

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
