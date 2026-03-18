import { PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'

/** “权限管理”模型 */
class AuthorityMgtModel {
    readonly index = 0
    company = -1
    name = ''
}

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
const authorityMgtTable = new TableModel<AuthorityMgtModel>([
    {
        _propName: 'index',
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
    },
    {
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 初始化:
authorityMgtTable.IsAllowMultiSelect.value = false

export {
    AuthorityMgtModel,
    pagination,
    authorityMgtTable,
}