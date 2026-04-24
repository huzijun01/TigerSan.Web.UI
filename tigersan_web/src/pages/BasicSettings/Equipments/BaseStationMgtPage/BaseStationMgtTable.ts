import { Colors, OnlineState, ItemType, ObjectHelper, OnlineStates, TableModel, IsEnable, Battery } from '@/0_tigersan_ui/tigerui'
import { BaseStationModel, companyHelper, siteHelper, stationTypeHelper } from '@/models'

// 列头:
const baseStationMgtTable = new TableModel<BaseStationModel>([
    {
        _propName: 'company',
        Text: '公司',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => companyHelper.GetName(source.company)
    },
    {
        _propName: 'site',
        Text: '场地',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => siteHelper.GetName(source.site)
    },
    {
        _propName: 'type',
        Text: '类型',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => stationTypeHelper.GetName(source.type)
    },
    {
        _propName: 'macAddr',
        Text: 'MAC地址',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'name',
        Text: '名称',
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
        _propName: 'isEnable',
        Text: '激活状态',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: IsEnable.GetString,
    },
    {
        _propName: 'onlineState',
        Text: '在线状态',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: OnlineState.GetString,
    },
    {
        _propName: 'heartbeatInterval',
        Text: '心跳（秒）',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'reportInterval',
        Text: '上报周期（秒）',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'monthOffline',
        Text: '当月离线总时长',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'createTime',
        Text: '创建时间',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: source => ObjectHelper.GetDateString(source.createTime)
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
baseStationMgtTable.IsAllowMultiSelect.value = true

baseStationMgtTable._initItem = itemModel => {
    if (itemModel._headerModel._propName === 'isEnable') {
        if (itemModel.GetSource()) {
            itemModel.Color.value = Colors.Success
            itemModel.Background.value = Colors.Success10
        } else {
            itemModel.Color.value = Colors.Danger
            itemModel.Background.value = Colors.Danger10
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

export {
    BaseStationModel,
    baseStationMgtTable,
}