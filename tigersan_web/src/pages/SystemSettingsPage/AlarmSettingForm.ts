import { ref, type InputHTMLAttributes } from 'vue'
import { FormModel, FormConfig, FormItemConfig } from '@/0_tigersan_ui/models'
import { IsWithinRange } from '@/0_tigersan_ui/helpers'

/** “预警设置”模型 */
class AlarmSettingModel {
    /** 电量预警值 */
    BatteryAlarmRate = 0
    /** 设备离线时间（分钟） */
    EqpOfflineMinutes = 0
    /** 设备离线时间（秒） */
    EqpOfflineSeconds = 0
}

/** “预警设置”实例 */
const alarmSetting = new AlarmSettingModel()
alarmSetting.BatteryAlarmRate = 20
alarmSetting.EqpOfflineMinutes = 0
alarmSetting.EqpOfflineSeconds = 20

/** “电量预警值”项目配置 */
const configBatteryAlarmRate: FormItemConfig = {
    _propName: 'BatteryAlarmRate',
    PropText: '电量预警值',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var alarmSetting = source as AlarmSettingModel
        return IsWithinRange(alarmSetting.BatteryAlarmRate, 1, 100)
    }
}

/** “设备离线时间（分钟）”项目配置 */
const configEqpOfflineMinutes: FormItemConfig = {
    _propName: 'EqpOfflineMinutes',
    PropText: '设备离线时间',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var alarmSetting = source as AlarmSettingModel
        return IsWithinRange(alarmSetting.EqpOfflineMinutes, 1, 1000)
    }
}

/** “设备离线时间（秒）”项目配置 */
const configEqpOfflineSeconds: FormItemConfig = {
    _propName: 'EqpOfflineSeconds',
    PropText: '',
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var alarmSetting = source as AlarmSettingModel
        return IsWithinRange(alarmSetting.EqpOfflineSeconds, 1, 59)
    }
}

/** “增”源数据获取方法 */
const GetSource = () => {
    return alarmSetting
}

/** “网关”表单配置 */
let configGatewayForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: GetSource,
    _itemConfigs: [
        configBatteryAlarmRate,
        configEqpOfflineSeconds,
        configEqpOfflineMinutes,
    ]
}

/** “网关”表单模型 */
const alarmSettingForm = new FormModel(configGatewayForm)

// 【方法】:
function SetBatteryAlarmRate(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    if (configBatteryAlarmRate.SetSource) {
        configBatteryAlarmRate.SetSource(input.value)
    }
}

function SetEqpOfflineMinutes(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    if (configEqpOfflineMinutes.SetSource) {
        configEqpOfflineMinutes.SetSource(input.value)
    }
}

function SetEqpOfflineSeconds(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    if (configEqpOfflineSeconds.SetSource) {
        configEqpOfflineSeconds.SetSource(input.value)
    }
}

export {
    alarmSettingForm,
    configBatteryAlarmRate,
    configEqpOfflineMinutes,
    configEqpOfflineSeconds,
    SetBatteryAlarmRate,
    SetEqpOfflineMinutes,
    SetEqpOfflineSeconds,
}