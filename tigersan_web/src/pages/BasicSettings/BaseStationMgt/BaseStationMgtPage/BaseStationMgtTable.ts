import { ref } from 'vue'
import { OnlineState, GetOnlineString, IsOnline } from '@/models'
import { Colors, ObjectHelper, PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'

/** “基站管理”模型 */
class BaseStationMgtModel {
    Index = 0
    MacAddr = ''
    EqpName = ''
    EqpType = ''
    OnlineState = OnlineState.Offline
    UpdateTime = ''
    Version = ''
}

// 字段:
const onlineCount = ref(0)
const offlineCount = ref(0)

// 分页器:
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

// 列头:
const baseStationMgtTable = new TableModel<BaseStationMgtModel>([
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
        Text: '型号',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'UpdateTime',
        Text: '更新时间',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'Version',
        Text: '蓝牙固件版本',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 数据:
const arr: BaseStationMgtModel[] =
    [
        {
            Index: 1,
            MacAddr: 'AC233FC21C39',
            EqpName: '009',
            OnlineState: OnlineState.Online,
            UpdateTime: '2026-01-21 17:33:56',
            EqpType: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 2,
            MacAddr: 'AC233FC23E1F',
            EqpName: 'MG6',
            OnlineState: OnlineState.Online,
            UpdateTime: '2026-01-12 11:06:27',
            EqpType: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 3,
            MacAddr: 'AC233FC22827',
            EqpName: 'qd-A',
            OnlineState: OnlineState.Online,
            UpdateTime: '2026-01-14 11:39:58',
            EqpType: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 4,
            MacAddr: 'AC233FC22827',
            EqpName: 'qd-B',
            OnlineState: OnlineState.Online,
            UpdateTime: '2026-01-14 11:39:58',
            EqpType: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 5,
            MacAddr: 'AC233FC22827',
            EqpName: 'qd-C',
            OnlineState: OnlineState.Online,
            UpdateTime: '2026-01-14 11:39:58',
            EqpType: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 6,
            MacAddr: 'AC233FC22827',
            EqpName: 'qd-D',
            OnlineState: OnlineState.Online,
            UpdateTime: '2026-01-14 11:39:58',
            EqpType: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 7,
            MacAddr: 'AC233FC22827',
            EqpName: 'qd-E',
            OnlineState: OnlineState.Offline,
            UpdateTime: '2026-01-14 11:39:58',
            EqpType: 'g1-e-grapes',
            Version: '3.7.0',
        },
    ]
baseStationMgtTable.RowDatas.push(...arr)

// 初始化:
baseStationMgtTable.IsAllowMultiSelect.value = false

baseStationMgtTable._initHeader = headerModel => {
    if (headerModel._propName === 'Index') {
        headerModel.Width.value = 50
    }
}

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

baseStationMgtTable._onInitRowModel = rowDatas => {
    pagination.Count.value = rowDatas.length
    onlineCount.value = rowDatas.filter(r => IsOnline(r)).length
    offlineCount.value = rowDatas.filter(r => !IsOnline(r)).length
}

export {
    BaseStationMgtModel,
    onlineCount,
    offlineCount,
    pagination,
    baseStationMgtTable,
}