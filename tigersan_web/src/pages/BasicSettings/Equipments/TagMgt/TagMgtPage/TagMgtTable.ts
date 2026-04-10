import { Colors, ObjectHelper, TableModel } from '@/0_tigersan_ui/tigerui'
import { OnlineState, GetOnlineString, TagModel, batchMgtHelper, baseStationMgtHelper, tagTypeMgtHelper, GetIsEnableString } from '@/models'

// 列头:
const tagMgtTable = new TableModel<TagModel>([
    // {
    //     _propName: 'id',
    //     Text: 'ID',
    //     Width: 50,
    //     IsReadonly: true,
    //     IsAllowWrap: false,
    // },
    {
        _propName: 'batch',
        Text: '批次',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => batchMgtHelper.GetValue(source.batch)
    },
    {
        _propName: 'type',
        Text: '类型',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => tagTypeMgtHelper.GetName(source.type)
    },
    {
        _propName: 'station',
        Text: '基站',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => baseStationMgtHelper.GetName(source.station ?? 0n)
    },
    {
        _propName: 'isEnable',
        Text: '激活状态',
        IsReadonly: true,
        IsAllowWrap: false,
        _getString: GetIsEnableString,
    },
    {
        _propName: 'onlineState',
        Text: '在线状态',
        IsReadonly: true,
        IsAllowWrap: false,
        _getString: GetOnlineString,
    },
    {
        _propName: 'tagId',
        Text: '标签ID',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'brandId',
        Text: '标牌ID',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'temperature',
        Text: '设备温度',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'signal',
        Text: '信号强度',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'comment',
        Text: '备注',
        IsReadonly: true,
        IsAllowWrap: false,
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
tagMgtTable.IsAllowMultiSelect.value = true

tagMgtTable._initItem = itemModel => {
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
        if (itemModel.GetSource() === OnlineState.Online) {
            itemModel.Color.value = Colors.Success
            itemModel.Background.value = Colors.Success10
        } else if (itemModel.GetSource() === OnlineState.Offline) {
            itemModel.Color.value = Colors.Danger
            itemModel.Background.value = Colors.Danger10
        }
    }

    if (itemModel._headerModel._propName === 'battery' ||
        itemModel._headerModel._propName === 'signal') {
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
    TagModel,
    tagMgtTable,
}