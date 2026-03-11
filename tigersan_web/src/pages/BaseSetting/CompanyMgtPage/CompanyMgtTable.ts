import { PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'

type CompanyEvent = (model: CompanyMgtModel) => void

// 分页器:
let paginationModel = new PaginationModel()
paginationModel.IsShowSelectedRowCount.value = true

/** "公司管理"模型 */
class CompanyMgtModel {
    index = 0
    name = ''
    addr = ''
    image = ''
    parent_company?: string
    onClick?: CompanyEvent
    onDelete?: CompanyEvent
    onEdit?: CompanyEvent
}

// 列头:
const companyMgtTable = new TableModel([
    {
        _propName: 'Name',
        Text: '公司名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'Addr',
        Text: '公司地址',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])
companyMgtTable.IsAllowMultiSelect.value = false

// 初始化:
companyMgtTable._initHeader = headerModel => {
    if (headerModel._propName === 'index') {
        headerModel.Width.value = 50
    }
}

companyMgtTable._initItem = itemModel => {
}

export {
    type CompanyEvent,
    CompanyMgtModel,
    companyMgtTable,
    paginationModel,
}