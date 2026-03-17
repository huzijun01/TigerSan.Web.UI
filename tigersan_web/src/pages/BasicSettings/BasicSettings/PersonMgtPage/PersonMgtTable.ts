import type { RoleMgtModel } from '../RoleMgt/RoleMgtTable'
import { PaginationModel, SearchModel, SelectModel, TableModel } from '@/0_tigersan_ui/tigerui'

/** 选择框 */
const selectRole = new SelectModel<RoleMgtModel>()
selectRole.Width.value = 208
selectRole.IsAllowSearch.value = true
selectRole.PlaceholderCN.value = '请选择角色'
selectRole.PlaceholderEN.value = 'Please select a role'
selectRole._converter = (role: RoleMgtModel): string => role.Name

/** 搜索“名称” */
const searchName = new SearchModel()
searchName.Placeholder.value = '请输人员名称'

/** “人员管理”模型 */
class PersonMgtModel {
    index = 0
    role = 0
    username = ''
    nickname = ''
    password = ''
    photo = ''
}

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
const personMgtTable = new TableModel<PersonMgtModel>([
    {
        _propName: 'index',
        Text: '序号',
        Width: 50,
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'role',
        Text: '角色',
        IsReadonly: true,
        IsAllowWrap: false,
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
])

// 初始化:
personMgtTable.IsAllowMultiSelect.value = false

export {
    selectRole,
    searchName,
    PersonMgtModel,
    pagination,
    personMgtTable,
}