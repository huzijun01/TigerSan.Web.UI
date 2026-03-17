import { CompanyMgtModel } from '../CompanyMgtPage/CompanyMgtTable'
import { PaginationModel, SearchModel, TableModel, SelectModel } from '@/0_tigersan_ui/tigerui'

/** 搜索“名称” */
const searchName = new SearchModel()
searchName.Placeholder.value = '请输角色名称'

/** 选择框 */
const selectCompany = new SelectModel<CompanyMgtModel>()
selectCompany.Width.value = 208
selectCompany.IsAllowSearch.value = true
selectCompany.PlaceholderCN.value = '请选择公司'
selectCompany.PlaceholderEN.value = 'Please select a company'
selectCompany._converter = (company: CompanyMgtModel): string => company.name

/** “角色管理”模型 */
class RoleMgtModel {
    index = 0
    company = -1
    name = ''
    navFolders = ''
    navButtons = ''
    readonlyButtons = ''
}

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
const roleMgtTable = new TableModel<RoleMgtModel>([
    {
        _propName: 'index',
        Text: '序号',
        Width: 50,
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'company',
        Text: '公司',
        IsReadonly: true,
        IsAllowWrap: false,
        _strGetter: source => GetCompanyName(source)
    },
    {
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'navFolders',
        Text: '导航目录',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'navButtons',
        Text: '导航按钮',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'readonlyButtons',
        Text: '只读按钮',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 初始化:
roleMgtTable.IsAllowMultiSelect.value = false

// 方法:
function GetCompany(role?: RoleMgtModel): CompanyMgtModel | undefined {
    if (!role) {
        console.warn('The role is undefined!')
        return
    }
    return selectCompany.Items.find(i => i.index === role.company)
}

function GetCompanyName(role?: RoleMgtModel): string {
    if (!role) {
        console.warn('The role is undefined!')
        return ''
    }
    const company = selectCompany.Items.find(i => i.index === role.company)
    return company ? company.name : ''
}

export {
    searchName,
    selectCompany,
    RoleMgtModel,
    pagination,
    roleMgtTable,
    GetCompany,
    GetCompanyName,
}