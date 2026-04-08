import { Texts, SelectModel, SearchModel } from '@/0_tigersan_ui/tigerui'

const searchMac = new SearchModel()
searchMac.Placeholder.value = '请输入名称或MAC'

const typeSelect = new SelectModel()
typeSelect.Width.value = 300
typeSelect.IsAllowSearch.value = true
typeSelect.Value.value = 'MST03 资产测温标签'
typeSelect.Items.push(...[
    '资产测温标签',
    'MWC03 MSR01-A 毫米波雷达传感器',
    'MWC04 MSR01-B 毫米波雷达传感器',
    'MST03 Light Sensor',
])

const selectState = new SelectModel()
selectState.Width.value = 120
selectState.Value.value = '全部'
selectState.Items.push(...['全部', '在线', '离线'])

export default {
    searchMac,
    typeSelect,
    selectState,
}