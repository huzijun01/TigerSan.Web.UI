import { TableModel } from "@/0_tigersan_ui/models"

class GatewayModel {
    Index = 0
    MacAddr = ''
    Name = ''
    State = ''
    Type = ''
    UpdateTime = ''
    Version = ''
}

let testTableModel = new TableModel([
    {
        _propName: 'Index',
        Text: '序号',
        IsReadonly: true,
    },
    {
        _propName: 'MacAddr',
        Text: 'MAC地址',
        IsReadonly: true,
    },
    {
        _propName: 'Name',
        Text: '网关名称',
        IsReadonly: true,
    },
    {
        _propName: 'State',
        Text: '状态',
        IsReadonly: true,
    },
    {
        _propName: 'Type',
        Text: '型号',
        IsReadonly: true,
    },
    {
        _propName: 'UpdateTime',
        Text: '更新时间',
        IsReadonly: true,
    },
    {
        _propName: 'Version',
        Text: '蓝牙固件版本',
        IsReadonly: true,
    },
])

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

export {
    GatewayModel,
    testTableModel
}