import { watch } from 'vue'
import { useUserInfo } from '@/stores'
import { SelectModel, TableModel, TreeHelper, TreeModel, TreeNodeConfig } from '@/0_tigersan_ui/tigerui'

type CompanyEvent = (model: CompanyMgtModel) => void

/** 树 */
const tree = new TreeModel<CompanyMgtModel>()
tree.IsShowCheckbox.value = false
tree._onActive = OnActive
tree._onUnactive = OnUnactive
tree._onInited = () => tree.SetActiveNode(selectParentCompany.Text.value)

/** 选择框 */
const selectParentCompany = new SelectModel()
selectParentCompany.Width.value = 208
selectParentCompany.IsAllowSearch.value = true
selectParentCompany.Placeholder.value = '请选择公司名称'
selectParentCompany._onSelect = OnSelect

/** 选择框（表单） */
const selectFormParentCompany = new SelectModel()
selectFormParentCompany.Width.value = 208
selectFormParentCompany.IsAllowSearch.value = true
selectFormParentCompany.Placeholder.value = '请选择公司名称'
selectFormParentCompany._converter = (obj: any) => {
    if (!obj) return ''
    const index = obj as number
    const company = tree.GetDatas().find(d => d.index === index)
    return company ? company.name : ''
}

/** "组织机构"模型 */
class CompanyMgtModel {
    index = 0
    name = ''
    addr = ''
    parentCompany?: number
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
        item => item.index,
        item => item.parentCompany)
}

/** 激活后 */
function OnActive() {
    selectParentCompany.Value.value = tree.ActiveData.value.name
}

/** 失活后 */
function OnUnactive() {
    selectParentCompany.Value.value = undefined
}

/** 选择后 */
function OnSelect() {
    tree.ActiveNode.value = tree.NodeArray.value.find(n => n.Text.value === selectParentCompany.Value.value)
}

watch(tree.ActiveNode, node => {
    const userInfo = useUserInfo()
    if (!node) {
        userInfo.Company = ''
    } else {
        userInfo.Company = tree.ActiveData.value.name
    }
})

export {
    tree,
    type CompanyEvent,
    CompanyMgtModel,
    companyMgtTable,
    selectParentCompany,
    selectFormParentCompany,
    Companies2Tree,
}