import { companyMgtHelper, DepartmentModel } from '@/models'
import { CompanyModel } from '../CompanyMgtPage/CompanyMgtTable'
import { PaginationModel, SearchModel, TableModel, SelectModel, BigintHelper } from '@/0_tigersan_ui/tigerui'

/** 搜索“名称” */
const searchName = new SearchModel()
searchName.Placeholder.value = '请输部门名称'

/** 选择框 */
const selectCompany = new SelectModel<CompanyModel>()
selectCompany.Width.value = 208
selectCompany.IsAllowSearch.value = true
selectCompany.PlaceholderCN.value = '请选择公司'
selectCompany.PlaceholderEN.value = 'Please select a company'
selectCompany._converter = (company: CompanyModel): string => company.name

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
const departmentMgtTable = new TableModel<DepartmentModel>([
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
        _getStringAsync: source => companyMgtHelper.GetNameAsync(source.company)
    },
    {
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 初始化:
departmentMgtTable.IsAllowMultiSelect.value = false

// 方法:
function GetCompany(department?: DepartmentModel): CompanyModel | undefined {
    if (!department) {
        console.warn('The department is undefined!')
        return
    }
    const company = selectCompany.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, department.company))
    if (!company) {
        console.warn('The company is undefined!')
    }
    return company
}

export {
    searchName,
    selectCompany,
    pagination,
    departmentMgtTable,
    GetCompany,
}