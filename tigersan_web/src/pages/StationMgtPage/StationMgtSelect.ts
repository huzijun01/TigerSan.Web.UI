import { SelectModel, SearchModel } from '@/0_tigersan_ui/tigerui'

const searchMac = new SearchModel()
searchMac.Placeholder.value = '请输入名称或MAC'

const typeSelect = new SelectModel()
typeSelect.Width.value = 300
typeSelect.Placeholder.value = '请选择'
typeSelect.Value.value = 'G1'
typeSelect.Items.push(...[
    'G1',
    'MG6',
    'MG8 Micro-USB LTE Station',
    'MG5 Outdoor LTE Station'])

const stateSelectModel = new SelectModel()
stateSelectModel.Width.value = 100
stateSelectModel.Value.value = '全部'
stateSelectModel.Items.push(...['全部', '在线', '离线'])

export default {
    searchMac,
    typeSelect,
    stateSelectModel,
}