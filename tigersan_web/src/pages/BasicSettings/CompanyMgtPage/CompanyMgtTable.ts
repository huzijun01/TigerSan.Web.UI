import { TableModel, TreeHelper, TreeModel, TreeNodeConfig } from '@/0_tigersan_ui/tigerui'

type CompanyEvent = (model: CompanyMgtModel) => void

// 树:
const tree = new TreeModel<CompanyMgtModel>()
tree.IsShowCheckbox.value = false

/** "组织机构"模型 */
class CompanyMgtModel {
    index = 0
    name = ''
    addr = ''
    parentCompany?: string
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

/** “公司数组”转“树配置” */
function Companies2Tree(companies: CompanyMgtModel[]): TreeNodeConfig<CompanyMgtModel>[] {
    return TreeHelper.Array2Tree<CompanyMgtModel>(
        companies,
        item => item.name,
        item => item.parentCompany)
}

export {
    tree,
    type CompanyEvent,
    CompanyMgtModel,
    companyMgtTable,
    Companies2Tree,
}