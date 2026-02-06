import { Colors } from "@/0_tigersan_ui/base"
import { TableModel, TextAlign } from "@/0_tigersan_ui/models"

/** “资产管理标签”模型 */
class AssetMgtLabelModel {
    Index = 0
    MacAddr = ''
    EqpType = ''
    Version = ''
    State = ''
    Battery = ''
    LastMsgTime = ''
    Operation = ''
}

// 列头:
let assetMgtLabelTable = new TableModel([
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
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'EqpType',
        Text: '设备型号',
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
        _propName: 'State',
        Text: '在线状态',
        IsReadonly: true,
        IsAllowWrap: false,
        TextAlign: TextAlign.Center,
    },
    {
        _propName: 'Battery',
        Text: '电量（%）',
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
let arr: AssetMgtLabelModel[] =
    [
        {
            Index: 1,
            MacAddr: 'EQP1',
            EqpType: 'Type1',
            Version: '1.0.0',
            State: '在线',
            Battery: '100',
            LastMsgTime: '2026-01-21 17:33:56',
            Operation: '操作1',
        },
    ]
assetMgtLabelTable.RowDatas.push(...arr)

// 初始化:
assetMgtLabelTable._initItem = itemModel => {
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
    AssetMgtLabelModel,
    assetMgtLabelTable,
}