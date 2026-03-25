import { PersonModel, roleMgtHelper } from '@/models'
import { BigintHelper, PaginationModel, SearchModel, TableModel } from '@/0_tigersan_ui/tigerui'

/** 选择框 */
const selectRole = roleMgtHelper.GetSelectModel()

/** 搜索“名称” */
const searchName = new SearchModel()
searchName.Placeholder.value = '请输人员名称'

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
const personMgtTable = new TableModel<PersonModel>([
    // {
    //     _propName: 'id',
    //     Text: 'ID',
    //     Width: 50,
    //     IsReadonly: true,
    //     IsAllowWrap: false,
    // },
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