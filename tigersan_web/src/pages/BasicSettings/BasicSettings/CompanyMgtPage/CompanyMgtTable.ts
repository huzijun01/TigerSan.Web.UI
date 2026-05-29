import { CompanyModel } from '@/models'
import { ItemType, TableModel } from '@/0_tigersan_ui/tigerui'

export const companyMgtTable = new TableModel<CompanyModel>([
    {
        _propName: 'Name',
        Text: '公司名称',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'Addr',
        Text: '公司地址',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
])
companyMgtTable.IsAllowMultiSelect.value = false

// 初始化:
companyMgtTable._initHeader = headerModel => {
    if (headerModel._propName === 'id') {
        headerModel.Width.value = 100
    }
}

companyMgtTable._initItem = itemModel => {
}