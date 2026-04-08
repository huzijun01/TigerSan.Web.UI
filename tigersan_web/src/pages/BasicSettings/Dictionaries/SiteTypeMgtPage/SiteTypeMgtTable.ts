import { TableModel } from '@/0_tigersan_ui/tigerui'
import { SiteTypeModel } from '@/models'

/** 列头 */
const siteTypeMgtTable = new TableModel<SiteTypeModel>([
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
siteTypeMgtTable.IsAllowMultiSelect.value = false

export {
    siteTypeMgtTable,
}