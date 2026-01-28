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
let g1 = new GatewayModel()
g1.Index = 1
g1.MacAddr = 'AC233FC21C39'
g1.Name = '009'
g1.State = '在线'
g1.UpdateTime = '2026-01-21 17:33:56'
g1.Type = 'g1-e-grapes'
g1.Version = '3.7.0'
testTableModel.RowDatas.push(g1)

let g2 = new GatewayModel()
g2.Index = 2
g2.MacAddr = 'AC233FC23E1F'
g2.Name = 'MG6'
g2.State = '在线'
g2.UpdateTime = '2026-01-12 11:06:27'
g2.Type = 'g2-e-grapes'
g2.Version = '3.7.0'
testTableModel.RowDatas.push(g2)

let g3 = new GatewayModel()
g3.Index = 3
g3.MacAddr = 'AC233FC22827'
g3.Name = 'qd-E'
g3.State = '离线'
g3.UpdateTime = '2026-01-14 11:39:58'
g3.Type = 'g3-e-grapes'
g3.Version = '3.7.0'
testTableModel.RowDatas.push(g3)

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