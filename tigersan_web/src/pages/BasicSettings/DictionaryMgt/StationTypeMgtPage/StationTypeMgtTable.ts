import { TableModel } from '@/0_tigersan_ui/tigerui'
import { StationTypeModel } from '@/models'

/** 列头 */
const stationTypeMgtTable = new TableModel<StationTypeModel>([
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
stationTypeMgtTable.IsAllowMultiSelect.value = false

export {
    stationTypeMgtTable,
}