import { SelectModel } from '@/0_tigersan_ui/tigerui'

const typeSelect = new SelectModel()
typeSelect.Width.value = 300
typeSelect.Placeholder.value = '请选择'
typeSelect.Value.value = 'MST03 资产测温标签'
typeSelect.Items.push(...[
    '资产测温标签',
    'MWC03 MSR01-A 毫米波雷达传感器',
    'MWC04 MSR01-B 毫米波雷达传感器',
    'MST03 Light Sensor',
])

const stateSelect = new SelectModel()
stateSelect.Width.value = 120
stateSelect.Value.value = '全部'
stateSelect.Items.push(...['全部', '在线', '离线'])

export default {
    typeSelect,
    stateSelect,
}