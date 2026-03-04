import { ref } from 'vue'
import { GetOnlineString, OnlineState, IsOnline } from '@/models'
import { Colors, ObjectHelper, PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'

/** "环境传感器"模型 */
class EnvSensorModel {
    Index = 0
    MacAddr = ''
    Version = ''
    OnlineState = OnlineState.Offline
    Battery = 0
    EqpTime = ''
    LastMsgTime = ''
    Operation = ''
}

// 字段:
const onlineCount = ref(0)
const offlineCount = ref(0)

// 分页器:
const paginationModel = new PaginationModel()
paginationModel.IsShowSelectedRowCount.value = true

// 列头:
const envSensorTable = new TableModel([
    {
        _propName: 'Index',
        Text: '序号',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'MacAddr',
        Text: 'MAC地址',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'Version',
        Text: '固件版本',
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
        _propName: 'Battery',
        Text: '电量（%）',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'EqpTime',
        Text: '设备时间',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'LastMsgTime',
        Text: '最近广播时间',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'Operation',
        Text: '操作',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 数据:
const arr: EnvSensorModel[] =
    [
        {
            Index: 1,
            MacAddr: 'EQP1',
            Version: '1.0.0',
            OnlineState: OnlineState.Online,
            Battery: 100,
            EqpTime: '2026-01-21 17:33:56',
            LastMsgTime: '2026-01-21 17:33:56',
            Operation: '操作1',
        },
        {
            Index: 2,
            MacAddr: 'EQP2',
            Version: '1.0.0',
            OnlineState: OnlineState.Online,
            Battery: 45,
            EqpTime: '2026-01-21 17:33:56',
            LastMsgTime: '2026-01-21 17:33:56',
            Operation: '操作1',
        },
        {
            Index: 3,
            MacAddr: 'EQP3',
            Version: '1.0.0',
            OnlineState: OnlineState.Offline,
            Battery: 20,
            EqpTime: '2026-01-21 17:33:56',
            LastMsgTime: '2026-01-21 17:33:56',
            Operation: '操作1',
        },
    ]
envSensorTable.RowDatas.push(...arr)

// 初始化:
envSensorTable.IsAllowMultiSelect.value = false

envSensorTable._initHeader = headerModel => {
    if (headerModel._propName === 'Index') {
        headerModel.Width.value = 50
    }
}

envSensorTable._initItem = itemModel => {
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

envSensorTable._onInitRowModel = rowDatas => {
    paginationModel.Count.value = rowDatas.length
    onlineCount.value = rowDatas.filter(r => IsOnline(r)).length
    offlineCount.value = rowDatas.filter(r => !IsOnline(r)).length
}

export {
    EnvSensorModel,
    onlineCount,
    offlineCount,
    paginationModel,
    envSensorTable,
}