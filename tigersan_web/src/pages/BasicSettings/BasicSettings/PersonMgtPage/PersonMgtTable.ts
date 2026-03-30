import { PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'
import { companyMgtHelper, departmentMgtHelper, PersonModel, roleMgtHelper } from '@/models'

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
const personMgtTable = new TableModel<PersonModel>([
    // {
    //     _propName: 'id',
    //     Text: 'ID',
    //     Width: 50,
    //     IsReadonly: true,
    //     IsAllowWrap: false,
    // },
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
        _propName: 'role',
        Text: '角色',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => roleMgtHelper.GetNameAsync(source.role)
    },
    {
        _propName: 'username',
        Text: '用户名',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'nickname',
        Text: '昵称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'phone',
        Text: '电话',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'mail',
        Text: '邮箱',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 初始化:
personMgtTable.IsAllowMultiSelect.value = false

export {
    pagination,
    personMgtTable,
}