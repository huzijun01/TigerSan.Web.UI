import { ObjectHelper, PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'
import { companyHelper, scenarioHelper, BatchModel } from '@/models'

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
const batchMgtTable = new TableModel<BatchModel>([
    {
        _propName: 'company',
        Text: '公司',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => companyHelper.GetName(source.company)
    },
    {
        _propName: 'scenario',
        Text: '场景',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => scenarioHelper.GetName(source.scenario)
    },
    {
        _propName: 'batchId',
        Text: '批次',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'shipmentTime',
        Text: '出货时间',
        IsReadonly: true,
        IsAllowWrap: false,
        _getString: source => ObjectHelper.GetDateString(source.shipmentTime)
    },
    {
        _propName: 'manager',
        Text: '联系人',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'phone',
        Text: '电话',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'comment',
        Text: '备注',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 初始化:
batchMgtTable.IsAllowMultiSelect.value = false

export {
    pagination,
    batchMgtTable,
}