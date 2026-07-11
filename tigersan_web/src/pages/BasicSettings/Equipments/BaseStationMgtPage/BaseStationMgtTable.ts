import { OnlineState, ItemType, ObjectHelper, TableModel, IsEnable, Battery, Texts, TextModel } from '@/0_tigersan_ui/tigerui'
import { BaseStationModel, companyHelper, siteHelper, stationTypeHelper } from '@/models'

// 列头:
export const baseStationMgtTable = new TableModel<BaseStationModel>([
    {
        _propName: 'company',
        Text: Texts.Company,
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => companyHelper.GetNameAsync(source.company)
    },
    {
        _propName: 'site',
        Text: Texts.Site,
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => siteHelper.GetNameAsync(source.site)
    },
    {
        _propName: 'type',
        Text: Texts.Type,
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => stationTypeHelper.GetNameAsync(source.type)
    },
    {
        _propName: 'macAddr',
        Text: Texts.MacAddr,
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'name',
        Text: Texts.Name,
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'addr',
        Text: Texts.Addr,
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'addrDetail',
        Text: Texts.AddrDetail,
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'isEnable',
        Text: Texts.IsEnable,
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: IsEnable.GetString,
    },
    {
        _propName: 'onlineState',
        Text: Texts.OnlineState,
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: OnlineState.GetString,
    },
    {
        _propName: 'heartbeatInterval',
        Text: TextModel.Computed('HeartbeatInterval (s)', '心跳（秒）'),
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'reportInterval',
        Text: TextModel.Computed('ReportInterval (s)', '上报周期（秒）'),
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'monthOffline',
        Text: TextModel.Computed('MonthOffline', '当月离线总时长'),
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'createTime',
        Text: Texts.CreateTime,
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: source => ObjectHelper.GetDateString(source.createTime)
    },
    {
        _propName: 'reportTime',
        Text: Texts.ReportTime,
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