import { CompanyMgtHelper, type RoleMgtModel } from '@/models'
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

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
const roleMgtTable = new TableModel<RoleMgtModel>([
    {
        _propName: 'id',
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
        _getStringAsync: source => CompanyMgtHelper.GetCompanyName(source.company)
    },
    {
        _propName: 'name',
        Text: '名称',
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
    return selectCompany.Items.find(i => i.id === role.company)
}

export {
    searchName,
    selectCompany,
    pagination,
    roleMgtTable,
    GetCompany,
}