import { ItemType, ObjectHelper, PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'
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
        Type: ItemType.TextBox,
        _getStringAsync: source => companyHelper.GetNameAsync(source.company)
    },
    {
        _propName: 'scenario',
        Text: '场景',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => scenarioHelper.GetNameAsync(source.scenario)
    },
    {
        _propName: 'batchId',
        Text: '批次',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'shipmentTime',
        Text: '出货时间',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: source => ObjectHelper.GetDateString(source.shipmentTime)
    },
    {
        _propName: 'manager',
        Text: '联系人',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'phone',
        Text: '电话',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'comment',
        Text: '备注',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
])

// 初始化:
batchMgtTable.IsAllowMultiSelect.value = false

export {
    pagination,
    batchMgtTable,
}