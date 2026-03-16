import { ref } from 'vue'
import { GetOnlineString, IsOnline, OnlineState } from '@/models'
import { Colors, ObjectHelper, PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'

/** “人员管理标签”模型 */
class PersonMgtTagModel {
    Index = 0
    IMEI = ''
    EqpName = ''
    EqpType = ''
    OnlineState = OnlineState.Offline
    BluetoothFirmware = ''
    KeyEvent = ''
    TriggerEvent = ''
    Battery = 0
    LastMsgTime = ''
}

// 字段:
const onlineCount = ref(0)
const offlineCount = ref(0)

// 分页器:
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

// 列头:
const personMgtTagTable = new TableModel<PersonMgtTagModel>([
    {
        _propName: 'Index',
        Text: '序号',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'IMEI',
        Text: 'IMEI',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'EqpName',
        Text: '设备名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'OnlineState',
        Text: '在线状态',
        IsReadonly: true,
        IsAllowWrap: false,
        _strGetter: GetOnlineString,
    },
    {
        _propName: 'EqpType',
        Text: '设备型号',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'BluetoothFirmware',
        Text: '蓝牙固件',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'KeyEvent',
        Text: '按键事件',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'TriggerEvent',
        Text: '触发事件',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'Battery',
        Text: '电量（%）',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'LastMsgTime',
        Text: '最近通讯时间',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 数据:
const arr: PersonMgtTagModel[] =
    [
        {
            Index: 1,
            IMEI: '863184079495485',
            EqpName: 'EQP1',
            EqpType: 'g1-e-grapes',
            OnlineState: OnlineState.Online,
            BluetoothFirmware: '固件1',
            KeyEvent: '事件1',
            TriggerEvent: '触发1',
            Battery: 100,
            LastMsgTime: '2026-01-21 17:33:56',
        },
        {
            Index: 2,
            IMEI: '863184079495485',
            EqpName: 'EQP2',
            EqpType: 'g1-e-grapes',
            OnlineState: OnlineState.Online,
            BluetoothFirmware: '固件2',
            KeyEvent: '事件2',
            TriggerEvent: '触发2',
            Battery: 45,
            LastMsgTime: '2026-01-21 17:33:56',
        },
        {
            Index: 3,
            IMEI: '863184079495485',
            EqpName: 'EQP1',
            EqpType: 'g1-e-grapes',
            OnlineState: OnlineState.Offline,
            BluetoothFirmware: '固件3',
            KeyEvent: '事件3',
            TriggerEvent: '触发3',
            Battery: 20,
            LastMsgTime: '2026-01-21 17:33:56',
        },
    ]
personMgtTagTable.RowDatas.push(...arr)

// 初始化:
personMgtTagTable.IsAllowMultiSelect.value = false

personMgtTagTable._initHeader = headerModel => {
    if (headerModel._propName === 'Index') {
        headerModel.Width.value = 50
    }
}

personMgtTagTable._initItem = itemModel => {
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

personMgtTagTable._onInitRowModel = rowDatas => {
    pagination.Count.value = rowDatas.length
    onlineCount.value = rowDatas.filter(r => IsOnline(r)).length
    offlineCount.value = rowDatas.filter(r => !IsOnline(r)).length
}


export {
    onlineCount,
    offlineCount,
    pagination,
    PersonMgtTagModel,
    personMgtTagTable,
}