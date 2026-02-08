import { TableModel, TextAlign } from "@/tigerui"

/** "操作重试"模型 */
class OperationRetryModel {
    Index = 0
    MacAddr = ''
    EqpType = ''
    OperationType = ''
    OperationTime = ''
    Operation = ''
}

// 列头:
let operationRetryTable = new TableModel([
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
        _propName: 'OperationType',
        Text: '操作类型',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'OperationTime',
        Text: '操作时间',
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
let arr: OperationRetryModel[] =
    [
        {
            Index: 1,
            MacAddr: 'AC233FC21C39',
            EqpType: 'MBT02',
            OperationType: '传感器',
            OperationTime: '2026-01-21 17:33:56',
            Operation: '操作1',
        },
    ]
operationRetryTable.RowDatas.push(...arr)

// 初始化:
operationRetryTable._initItem = itemModel => {
}

export {
    OperationRetryModel,
    operationRetryTable,
}