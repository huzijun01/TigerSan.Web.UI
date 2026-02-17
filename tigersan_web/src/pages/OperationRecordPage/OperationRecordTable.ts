import { TableModel, TextAlign } from '@/0_tigersan_ui/tigerui'

/** "操作记录"模型 */
class OperationRecordModel {
    Index = 0
    OperationType = ''
    ProductType = ''
    StartTime = ''
    StopTime = ''
    TotalSpentTime = ''
    EqpCount = 0
    SuccessCount = 0
    FailCount = 0
    SuccessRate = 0
}

// 列头:
let operationRecordTable = new TableModel([
    {
        _propName: 'Index',
        Text: '序号',
        TextAlign: TextAlign.Center,
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
        _propName: 'ProductType',
        Text: '产品类型',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'StartTime',
        Text: '开始时间',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'StopTime',
        Text: '结束时间',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'TotalSpentTime',
        Text: '总共用时',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'EqpCount',
        Text: '设备总数',
        IsReadonly: true,
        IsAllowWrap: false,
        TextAlign: TextAlign.Center,
    },
    {
        _propName: 'SuccessCount',
        Text: '成功个数',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'FailCount',
        Text: '失败个数',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'SuccessRate',
        Text: '成功率',
        IsReadonly: true,
        IsAllowWrap: false,
        _strGetter: (obj: object, propName: string) => {
            let record = obj as OperationRecordModel
            return `${record.SuccessRate.toFixed(2)}%`
        }
    },
])

// 数据:
let arr: OperationRecordModel[] =
    [
        {
            Index: 1,
            OperationType: '传感器',
            ProductType: 'MBT02',
            StartTime: '2026-01-21 17:33:56',
            StopTime: '2026-01-21 17:33:56',
            TotalSpentTime: '9秒',
            EqpCount: 1,
            SuccessCount: 1,
            FailCount: 0,
            SuccessRate: 100,
        },
    ]
operationRecordTable.RowDatas.push(...arr)

// 初始化:
operationRecordTable._initItem = itemModel => {
}

export {
    OperationRecordModel,
    operationRecordTable,
}