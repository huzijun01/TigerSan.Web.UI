import { companyMgtHelper, DepartmentModel } from '@/models'
import { PaginationModel, SearchModel, TableModel } from '@/0_tigersan_ui/tigerui'

/** 搜索“名称” */
const searchName = new SearchModel()
searchName.Placeholder.value = '请输部门名称'

/** 选择框 */
const selectCompany = companyMgtHelper.GetSelectModel()

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

export {
    searchName,
    selectCompany,
    pagination,
    departmentMgtTable,
}