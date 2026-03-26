import { TableModel } from '@/0_tigersan_ui/tigerui'
import { companyMgtHelper, departmentMgtHelper, RoleAuthorityModel } from '@/models'

/** 列头 */
const roleMgtTable = new TableModel<RoleAuthorityModel>([
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
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 初始化:
roleMgtTable.IsAllowMultiSelect.value = false

export {
    roleMgtTable,
}