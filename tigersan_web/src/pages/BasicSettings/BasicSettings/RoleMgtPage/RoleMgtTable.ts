import { ItemType, TableModel } from '@/0_tigersan_ui/tigerui'
import { companyHelper, departmentHelper, RoleAuthorityModel } from '@/models'

/** 列头 */
export const roleMgtTable = new TableModel<RoleAuthorityModel>([
    {
        _propName: 'company',
        Text: '公司',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => companyHelper.GetNameAsync(source.company)
    },
    {
        _propName: 'department',
        Text: '部门',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => departmentHelper.GetNameAsync(source.department)
    },
    {
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
])

// 初始化:
roleMgtTable.IsAllowMultiSelect.value = false