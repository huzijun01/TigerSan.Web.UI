import { OnlineState, ItemType, ObjectHelper, TableModel, IsEnable, Battery, Texts, TextModel } from '@/0_tigersan_ui/tigerui'
import { BaseStationDto } from '@/models'

export function GetStationTable() {
    // 列头:
    const table = new TableModel<BaseStationDto>([
        {
            _propName: 'macAddr',
            Text: Texts.MacAddr,
            IsReadonly: true,
            IsFreeze: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'companyName',
            Text: Texts.Company,
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'siteName',
            Text: Texts.Site,
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'typeName',
            Text: Texts.Type,
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
    table.IsAllowMultiSelect.value = true

    table._initItem = itemModel => {
        IsEnable.InitItemModel(itemModel)
        OnlineState.InitItemModel(itemModel)
        Battery.InitItemModel(itemModel)
    }

    return table
}