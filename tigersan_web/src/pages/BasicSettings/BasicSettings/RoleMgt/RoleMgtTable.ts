import { companyMgtHelper, departmentMgtHelper, RoleAuthorityModel } from '@/models'
import { PaginationModel, SearchModel, TableModel } from '@/0_tigersan_ui/tigerui'

/** 搜索“名称” */
const searchName = new SearchModel()
searchName.Placeholder.value = '请输角色名称'

/** 选择框 */
const selectCompany = companyMgtHelper.GetSelectModel()
const selectDepartment = departmentMgtHelper.GetSelectModel()

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
const roleMgtTable = new TableModel<RoleAuthorityModel>([
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
        _propName: 'department',
        Text: '部门',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => departmentMgtHelper.GetNameAsync(source.department)
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

export {
    searchName,
    selectCompany,
    selectDepartment,
    pagination,
    roleMgtTable,
}