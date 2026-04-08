import { TableModel } from '@/0_tigersan_ui/tigerui'
import { TagTypeModel } from '@/models'

/** 列头 */
const tagTypeMgtTable = new TableModel<TagTypeModel>([
    // {
    //     _propName: 'id',
    //     Text: 'ID',
    //     Width: 50,
    //     IsReadonly: true,
    //     IsAllowWrap: false,
    // },
    {
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 初始化:
tagTypeMgtTable.IsAllowMultiSelect.value = false

export {
    tagTypeMgtTable,
}