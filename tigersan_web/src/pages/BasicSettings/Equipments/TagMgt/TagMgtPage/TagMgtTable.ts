import { Colors, IsEnable, ItemType, ObjectHelper, OnlineState, OnlineStates, TableModel } from '@/0_tigersan_ui/tigerui'
import { TagModel, batchHelper, tagTypeHelper, baseStationHelper } from '@/models'

// 列头:
const tagMgtTable = new TableModel<TagModel>([
    {
        _propName: 'companyName',
        Text: '公司',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'batch',
        Text: '批次',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => batchHelper.GetValue(source.batch)
    },
    {
        _propName: 'type',
        Text: '类型',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => tagTypeHelper.GetName(source.type)
    },
    {
        _propName: 'station',
        Text: '基站',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => baseStationHelper.GetName(source.station)
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
        _propName: 'tagId',
        Text: '标签ID',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'brandId',
        Text: '标牌ID',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'battery',
        Text: '电量',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'signal',
        Text: '信号强度',
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
        _propName: 'lastReportTime',
        Text: '最后上报时间',
        IsReadonly: true,
        Type: ItemType.TextBox,
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
        if (itemModel.GetSource() === OnlineStates.Online) {
            itemModel.Color.value = Colors.Success
            itemModel.Background.value = Colors.Success10
        } else {
            itemModel.Color.value = Colors.Danger
            itemModel.Background.value = Colors.Danger10
        }
    }

    if (itemModel._headerModel._propName === 'signal') {
        const signal = itemModel.GetSource() as number
        if (signal < 30) {
            itemModel.Color.value = Colors.Success
        } else if (signal < 90) {
            itemModel.Color.value = Colors.Warning
        } else {
            itemModel.Color.value = Colors.Danger
        }
    }

    if (itemModel._headerModel._propName === 'battery') {
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