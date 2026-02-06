import { Colors } from "@/0_tigersan_ui/base"
import { TableModel, TextAlign } from "@/0_tigersan_ui/models"

/** “人员管理标签”模型 */
class PersonMgtLabelModel {
    Index = 0
    IMEI = ''
    EqpName = ''
    EqpType = ''
    State = ''
    BluetoothFirmware = ''
    KeyEvent = ''
    TriggerEvent = ''
    Battery = ''
    LastMsgTime = ''
}

// 列头:
let personMgtLabelTable = new TableModel([
    {
        _propName: 'Index',
        Text: '序号',
        TextAlign: TextAlign.Center,
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'IMEI',
        Text: 'IMEI',
        TextAlign: TextAlign.Center,
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
        _propName: 'State',
        Text: '在线状态',
        IsReadonly: true,
        IsAllowWrap: false,
        TextAlign: TextAlign.Center,
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
let arr: PersonMgtLabelModel[] =
    [
        {
            Index: 1,
            IMEI: '863184079495485',
            EqpName: 'EQP1',
            EqpType: 'g1-e-grapes',
            State: '在线',
            BluetoothFirmware: '固件1',
            KeyEvent: '事件1',
            TriggerEvent: '触发1',
            Battery: '100',
            LastMsgTime: '2026-01-21 17:33:56',
        },
    ]
personMgtLabelTable.RowDatas.push(...arr)

// 初始化:
personMgtLabelTable._initItem = itemModel => {
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
    PersonMgtLabelModel,
    personMgtLabelTable,
}