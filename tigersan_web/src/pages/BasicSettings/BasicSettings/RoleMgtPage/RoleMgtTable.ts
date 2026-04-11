import { TableModel } from '@/0_tigersan_ui/tigerui'
import { companyMgtHelper, departmentMgtHelper, RoleAuthorityModel } from '@/models'

/** 列头 */
const roleMgtTable = new TableModel<RoleAuthorityModel>([
    {
        _propName: 'company',
        Text: '公司',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => companyMgtHelper.GetName(source.company)
    },
    {
        _propName: 'department',
        Text: '部门',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => departmentMgtHelper.GetName(source.department)
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