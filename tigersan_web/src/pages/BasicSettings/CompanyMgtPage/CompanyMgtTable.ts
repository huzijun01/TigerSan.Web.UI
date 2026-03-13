import { ArrayHelper, PaginationModel, TableModel, TreeModel, TreeNodeConfig, TreeNodeModel } from '@/0_tigersan_ui/tigerui'

type CompanyEvent = (model: CompanyMgtModel) => void

// 分页器:
let pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

// 树:
const tree = new TreeModel()
tree.IsShowCheckbox.value = false

/** "公司管理"模型 */
class CompanyMgtModel {
    index = 0
    name = ''
    addr = ''
    image = ''
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

function GetNode(company: CompanyMgtModel): TreeNodeConfig {
    const node = new TreeNodeConfig()
    node._data = company
    node.Text = company.name
    return node
}

function Companies2Tree(companies: CompanyMgtModel[]): TreeNodeConfig[] {
    const nodes: TreeNodeConfig[] = []
    const nodeArray: TreeNodeConfig[] = []

    /** “根公司”集合 */
    let rootCompanies = companies.filter(c => c.parentCompany === null)
    /** “剩余公司”集合 */
    const remainingCompanies = companies.filter(c => c.parentCompany != null)
    /** “新根公司”集合 */
    const newRootCompanies: CompanyMgtModel[] = []

    // 添加“根公司”:
    rootCompanies.forEach(rootCompany => {
        /** 根节点 */
        const rootNode = GetNode(rootCompany)
        rootNode.Childs = []
        nodes.push(rootNode)
        nodeArray.push(rootNode)
    })

    // 添加“后代公司”:
    while (rootCompanies.length > 0) {
        newRootCompanies.splice(0)

        // 添加“根公司”:
        rootCompanies.forEach(rootCompany => {
            /** 根节点 */
            const rootNode = nodeArray.find(n => n.Text === rootCompany.name)
            if (!rootNode) {
                console.warn('The rootNode is undefined!')
                return
            }

            /** “孙公司”集合 */
            const subCompanies = remainingCompanies.filter(c => c.parentCompany === rootCompany.name)
            newRootCompanies.push(...subCompanies)

            // 添加“根节点”:
            subCompanies.forEach(subCompany => {
                // 添加“孙节点”:
                const subNode = GetNode(subCompany)
                if (!rootNode.Childs) {
                    rootNode.Childs = []
                }
                rootNode.Childs.push(subNode)
                nodeArray.push(subNode)

                // 删除“孙公司”:
                ArrayHelper.DeleteItem(remainingCompanies, subCompany)
            })
        })

        rootCompanies.splice(0)
        rootCompanies.push(...newRootCompanies)
    }

    if (remainingCompanies.length > 0) {
        console.warn('There are unused companies!')
    }

    return nodes
}

export {
    tree,
    type CompanyEvent,
    CompanyMgtModel,
    companyMgtTable,
    pagination,
    Companies2Tree,
}