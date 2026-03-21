import { PersonModel, RoleModel } from '@/models'
import { BigintHelper, PaginationModel, SearchModel, SelectModel, TableModel } from '@/0_tigersan_ui/tigerui'

/** 选择框 */
const selectRole = new SelectModel<RoleModel>()
selectRole.Width.value = 208
selectRole.IsAllowSearch.value = true
selectRole.PlaceholderCN.value = '请选择角色'
selectRole.PlaceholderEN.value = 'Please select a role'
selectRole._converter = (role: RoleModel): string => role.name

/** 搜索“名称” */
const searchName = new SearchModel()
searchName.Placeholder.value = '请输人员名称'

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
const personMgtTable = new TableModel<PersonModel>([
    {
        _propName: 'id',
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
        _getString: source => GetRoleName(source.role)
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

// 方法:
function GetRoleName(index: number | bigint): string {
    const company = selectRole.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, index))
    return company ? company.name : ''
}

export {
    selectRole,
    searchName,
    PersonModel,
    pagination,
    personMgtTable,
}