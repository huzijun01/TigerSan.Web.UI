import { SelectModel, SearchModel } from '@/0_tigersan_ui/tigerui'

const searchIMEI = new SearchModel()
searchIMEI.Placeholder.value = '请输入IMEI'

const typeSelect = new SelectModel()
typeSelect.Width.value = 300
typeSelect.Placeholder.value = '请选择'
typeSelect.Value.value = 'MWC03 4G智能工牌'
typeSelect.Items.push(...[
    'MWC03 4G智能工牌',
    'MWC04 4G小型融合定位工牌',
])

const stateSelect = new SelectModel()
stateSelect.Width.value = 120
stateSelect.Placeholder.value = '请选择'
stateSelect.Value.value = '全部'
stateSelect.Items.push(...['全部', '在线', '离线'])

const bluetoothFirmwareSelect = new SelectModel()
bluetoothFirmwareSelect.Width.value = 120
bluetoothFirmwareSelect.Value.value = '全部'
bluetoothFirmwareSelect.Items.push(...['全部'])

export default {
    searchIMEI,
    typeSelect,
    stateSelect,
    bluetoothFirmwareSelect,
}