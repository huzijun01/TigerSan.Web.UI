import { ItemType, TableModel } from '@/0_tigersan_ui/tigerui'
import { companyHelper, departmentHelper, PersonModel, roleHelper } from '@/models'

/** 列头 */
export const personMgtTable = new TableModel<PersonModel>([
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
        _propName: 'role',
        Text: '角色',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => roleHelper.GetNameAsync(source.role)
    },
    {
        _propName: 'username',
        Text: '用户名',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'nickname',
        Text: '昵称',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'phone',
        Text: '电话',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'mail',
        Text: '邮箱',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
])

// 初始化:
personMgtTable.IsAllowMultiSelect.value = false