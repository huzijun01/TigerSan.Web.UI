import { ref } from 'vue'
import { OnlineState } from '@/models'
import { Colors, ObjectHelper, PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'

/** “基站管理”模型 */
class BaseStationMgtModel {
    Index = 0
    MacAddr = ''
    Name = ''
    State = OnlineState.Offline
    Type = ''
    UpdateTime = ''
    Version = ''
}

// 字段:
const onlineCount = ref(0)
const offlineCount = ref(0)

// 分页器:
const paginationModel = new PaginationModel()
paginationModel.IsShowSelectedRowCount.value = true

// 列头:
const baseStationMgtTable = new TableModel([
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
        _propName: 'Name',
        Text: '设备名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'State',
        Text: '在线状态',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'Type',
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
            Name: '009',
            State: OnlineState.Online,
            UpdateTime: '2026-01-21 17:33:56',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 2,
            MacAddr: 'AC233FC23E1F',
            Name: 'MG6',
            State: OnlineState.Online,
            UpdateTime: '2026-01-12 11:06:27',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 3,
            MacAddr: 'AC233FC22827',
            Name: 'qd-A',
            State: OnlineState.Online,
            UpdateTime: '2026-01-14 11:39:58',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 4,
            MacAddr: 'AC233FC22827',
            Name: 'qd-B',
            State: OnlineState.Online,
            UpdateTime: '2026-01-14 11:39:58',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 5,
            MacAddr: 'AC233FC22827',
            Name: 'qd-C',
            State: OnlineState.Online,
            UpdateTime: '2026-01-14 11:39:58',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 6,
            MacAddr: 'AC233FC22827',
            Name: 'qd-D',
            State: OnlineState.Online,
            UpdateTime: '2026-01-14 11:39:58',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 7,
            MacAddr: 'AC233FC22827',
            Name: 'qd-E',
            State: OnlineState.Offline,
            UpdateTime: '2026-01-14 11:39:58',
            Type: 'g1-e-grapes',
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
    if (itemModel._headerModel._propName === 'State') {
        if (itemModel.Text.value === OnlineState.Online) {
            itemModel.Color.value = Colors.Success
            itemModel.Background.value = Colors.Success10
        } else if (itemModel.Text.value === OnlineState.Offline) {
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
    paginationModel.Count.value = rowDatas.length
    onlineCount.value = rowDatas.filter(r => ObjectHelper.IsEqual(r, 'State', OnlineState.Online)).length
    offlineCount.value = rowDatas.filter(r => ObjectHelper.IsEqual(r, 'State', OnlineState.Offline)).length
}

export {
    BaseStationMgtModel,
    onlineCount,
    offlineCount,
    paginationModel,
    baseStationMgtTable,
}