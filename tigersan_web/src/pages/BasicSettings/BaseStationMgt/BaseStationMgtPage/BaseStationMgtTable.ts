import { Colors, ObjectHelper, TableModel } from '@/0_tigersan_ui/tigerui'
import { OnlineState, GetOnlineString, BaseStationModel, companyMgtHelper, siteMgtHelper, stationTypeMgtHelper } from '@/models'

// 列头:
const baseStationMgtTable = new TableModel<BaseStationModel>([
    // {
    //     _propName: 'id',
    //     Text: 'ID',
    //     Width: 50,
    //     IsReadonly: true,
    //     IsAllowWrap: false,
    // },
    {
        _propName: 'company',
        Text: '公司',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => companyMgtHelper.GetName(source.company)
    },
    {
        _propName: 'site',
        Text: '场地',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => siteMgtHelper.GetName(source.site)
    },
    {
        _propName: 'type',
        Text: '类型',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => stationTypeMgtHelper.GetName(source.type)
    },
    {
        _propName: 'macAddr',
        Text: 'MAC地址',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'addr',
        Text: '更新时间',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'onlineState',
        Text: '在线状态',
        IsReadonly: true,
        IsAllowWrap: false,
        _getString: GetOnlineString,
    },
    {
        _propName: 'heartbeatInterval',
        Text: '心跳（秒）',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'reportInterval',
        Text: '上报周期（秒）',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'monthOffline',
        Text: '当月离线总时长',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'createTime',
        Text: '创建时间',
        IsReadonly: true,
        IsAllowWrap: false,
        _getString: source => ObjectHelper.GetDateString(source.createTime)
    },
    {
        _propName: 'lastReportTime',
        Text: '最后上报时间',
        IsReadonly: true,
        IsAllowWrap: false,
        _getString: source => ObjectHelper.GetDateString(source.lastReportTime)
    },
])

// 初始化:
baseStationMgtTable.IsAllowMultiSelect.value = false

baseStationMgtTable._initItem = itemModel => {
    if (itemModel._headerModel._propName === 'OnlineState') {
        if (itemModel.GetSource() === OnlineState.Online) {
            itemModel.Color.value = Colors.Success
            itemModel.Background.value = Colors.Success10
        } else if (itemModel.GetSource() === OnlineState.Offline) {
            itemModel.Color.value = Colors.Danger
            itemModel.Background.value = Colors.Danger10
        }
    }

    if (itemModel._headerModel._propName === 'Battery') {
        const battery = itemModel.GetSource() as number
        if (battery >= 50) {
            itemModel.Color.value = Colors.Success
        } else if (battery >= 25) {
            itemModel.Color.value = Colors.Warning
        } else {
            itemModel.Color.value = Colors.Danger
        }
    }
}

export {
    BaseStationModel,
    baseStationMgtTable,
}