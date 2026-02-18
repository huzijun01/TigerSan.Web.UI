import { SelectModel, SearchModel } from '@/0_tigersan_ui/tigerui'

const searchMac = new SearchModel()
searchMac.Placeholder.value = '请输入名称或MAC'

const typeSelect = new SelectModel()
typeSelect.Width.value = 300
typeSelect.Placeholder.value = '请选择'
typeSelect.Value.value = 'MBT02 可连接资产标签'
typeSelect.Items.push(...[
    'MBT02 可连接资产标签',
    'MBT02 资产中继器',
    'MTB04 5G资产标签',
])

const stateSelect = new SelectModel()
stateSelect.Width.value = 120
stateSelect.Value.value = '全部'
stateSelect.Items.push(...['全部', '在线', '离线'])

const firmwareSelect = new SelectModel()
firmwareSelect.Width.value = 120
firmwareSelect.Value.value = '全部'
firmwareSelect.Items.push(...[
    '全部',
    '3.2.0'
])

export default {
    searchMac,
    typeSelect,
    stateSelect,
    firmwareSelect,
}