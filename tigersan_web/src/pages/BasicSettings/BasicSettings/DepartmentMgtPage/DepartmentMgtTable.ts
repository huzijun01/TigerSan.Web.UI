import { companyHelper, DepartmentModel } from '@/models'
import { TableModel } from '@/0_tigersan_ui/tigerui'

/** 列头 */
const departmentMgtTable = new TableModel<DepartmentModel>([
    {
        _propName: 'company',
        Text: '公司',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => companyHelper.GetName(source.company)
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
    departmentMgtTable,
}