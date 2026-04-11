import { TableModel } from '@/0_tigersan_ui/tigerui'
import { ScenarioModel } from '@/models'

/** 列头 */
const scenarioMgtTable = new TableModel<ScenarioModel>([
    {
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 初始化:
scenarioMgtTable.IsAllowMultiSelect.value = false

export {
    scenarioMgtTable,
}