import { PaginationModel, SearchModel, TableModel } from '@/0_tigersan_ui/tigerui'

/** 搜索“名称” */
const searchName = new SearchModel()
searchName.Placeholder.value = '请输角色名称'

/** “角色管理”模型 */
class RoleMgtModel {
    Index = -1
    Company = -1
    Name = ''
    NavFolders = ''
    NavButtons = ''
    ReadonlyButtons = ''
}

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
const roleMgtTable = new TableModel<RoleMgtModel>([
    {
        _propName: 'Index',
        Text: '序号',
        Width: 50,
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'Role',
        Text: '角色',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'Username',
        Text: '用户名',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'Nickname',
        Text: '昵称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 初始化:
roleMgtTable.IsAllowMultiSelect.value = false

export {
    searchName,
    RoleMgtModel,
    pagination,
    roleMgtTable,
}