import { OnlineState, ItemType, ObjectHelper, TableModel, IsEnable, Battery } from '@/0_tigersan_ui/tigerui'
import { BaseStationModel, companyHelper, siteHelper, stationTypeHelper } from '@/models'

// 列头:
export const baseStationMgtTable = new TableModel<BaseStationModel>([
    {
        _propName: 'company',
        Text: '公司',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => companyHelper.GetNameAsync(source.company)
    },
    {
        _propName: 'site',
        Text: '场地',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => siteHelper.GetNameAsync(source.site)
    },
    {
        _propName: 'type',
        Text: '类型',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => stationTypeHelper.GetNameAsync(source.type)
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
    IsEnable.InitItemModel(itemModel)
    OnlineState.InitItemModel(itemModel)
    Battery.InitItemModel(itemModel)
}