import { TableModel, TextAlign } from "@/0_tigersan_ui/models"
import { Colors } from "./0_tigersan_ui/base"

/** 网关模型 */
class GatewayModel {
    Index = 0
    MacAddr = ''
    Name = ''
    State = ''
    Type = ''
    UpdateTime = ''
    Version = ''
}

// 列头:
let testTableModel = new TableModel([
    {
        _propName: 'Index',
        Text: '序号',
        TextAlign: TextAlign.Center,
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'MacAddr',
        Text: 'MAC地址',
        TextAlign: TextAlign.Center,
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'Name',
        Text: '网关名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'State',
        Text: '状态',
        IsReadonly: true,
        IsAllowWrap: false,
        TextAlign: TextAlign.Center,
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
let arr: GatewayModel[] =
    [
        {
            Index: 1,
            MacAddr: 'AC233FC21C39',
            Name: '009',
            State: '在线',
            UpdateTime: '2026-01-21 17:33:56',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 2,
            MacAddr: 'AC233FC23E1F',
            Name: 'MG6',
            State: '在线',
            UpdateTime: '2026-01-12 11:06:27',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 3,
            MacAddr: 'AC233FC22827',
            Name: 'qd-A',
            State: '在线',
            UpdateTime: '2026-01-14 11:39:58',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 4,
            MacAddr: 'AC233FC22827',
            Name: 'qd-B',
            State: '在线',
            UpdateTime: '2026-01-14 11:39:58',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 5,
            MacAddr: 'AC233FC22827',
            Name: 'qd-C',
            State: '在线',
            UpdateTime: '2026-01-14 11:39:58',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 6,
            MacAddr: 'AC233FC22827',
            Name: 'qd-D',
            State: '在线',
            UpdateTime: '2026-01-14 11:39:58',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
        {
            Index: 7,
            MacAddr: 'AC233FC22827',
            Name: 'qd-E',
            State: '离线',
            UpdateTime: '2026-01-14 11:39:58',
            Type: 'g1-e-grapes',
            Version: '3.7.0',
        },
    ]
testTableModel.RowDatas.push(...arr)

// 初始化:
testTableModel._initItem = itemModel => {
    if (itemModel._headerModel._propName === 'State') {
        if (itemModel.Text.value === '在线') {
            itemModel.Color.value = Colors.Success
            itemModel.Background.value = Colors.Success10
        } else if (itemModel.Text.value === '离线') {
            itemModel.Color.value = Colors.Danger
            itemModel.Background.value = Colors.Danger10
        }
    }
}

export {
    GatewayModel,
    testTableModel
}