import { Texts, SelectModel, SearchModel } from '@/0_tigersan_ui/tigerui'

const searchMac = new SearchModel()
searchMac.Placeholder.value = '请输入名称或MAC'

const typeSelect = new SelectModel()
typeSelect.Width.value = 300
typeSelect.IsAllowSearch.value = true
typeSelect.Value.value = 'G1'
typeSelect.Items.push(...[
    'G1',
    'MG6',
    'MG8 Micro-USB LTE Station',
    'MG5 Outdoor LTE Station'])

const stateSelect = new SelectModel()
stateSelect.Width.value = 100
stateSelect.Value.value = '全部'
stateSelect.Items.push(...['全部', '在线', '离线'])

export default {
    searchMac,
    typeSelect,
    stateSelect,
}