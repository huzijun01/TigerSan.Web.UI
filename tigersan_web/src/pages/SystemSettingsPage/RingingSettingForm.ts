import { ref, type InputHTMLAttributes } from 'vue'
import { FormModel, FormConfig, FormItemConfig } from '@/0_tigersan_ui/models'
import { IsNotUndefinedOrEmpty, IsWithinRange } from '@/0_tigersan_ui/helpers'

/** “响铃设置”模型 */
class RingingSettingModel {
    /** 产品类型 */
    ProductType? = ''
    /** 固件版本 */
    FirmwareVersion? = ''
    /** 是否启用 */
    Enable = 0
}

/** “响铃设置”实例 */
const ringingSetting = new RingingSettingModel()
ringingSetting.ProductType = undefined
ringingSetting.FirmwareVersion = undefined
ringingSetting.Enable = 20

/** “产品类型”项目配置 */
const configRingingProductType: FormItemConfig = {
    _propName: 'ProductType',
    PropText: '产品类型',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var ringingSetting = source as RingingSettingModel
        return IsNotUndefinedOrEmpty(ringingSetting.ProductType)
    }
}

/** “固件版本”项目配置 */
const configRingingFirmwareVersion: FormItemConfig = {
    _propName: 'FirmwareVersion',
    PropText: '固件版本',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var ringingSetting = source as RingingSettingModel
        return IsNotUndefinedOrEmpty(ringingSetting.FirmwareVersion)
    }
}

/** “是否启用”项目配置 */
const configRingingEnable: FormItemConfig = {
    _propName: 'Enable',
    PropText: '响铃设置',
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var ringingSetting = source as RingingSettingModel
        return IsWithinRange(ringingSetting.Enable, 1, 59)
    }
}

/** “增”源数据获取方法 */
const GetSource = () => {
    return ringingSetting
}

/** “网关”表单配置 */
let configGatewayForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: GetSource,
    _itemConfigs: [
        configRingingProductType,
        configRingingEnable,
        configRingingFirmwareVersion,
    ]
}

/** “网关”表单模型 */
const ringingSettingForm = new FormModel(configGatewayForm)

// 【方法】:
function SetRingingProductType(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    if (configRingingProductType.SetSource) {
        configRingingProductType.SetSource(input.value)
    }
}

function SetRingingFirmwareVersion(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    if (configRingingFirmwareVersion.SetSource) {
        configRingingFirmwareVersion.SetSource(input.value)
    }
}

function SetRingingEnableRinging(payload: Event) {
    const input = payload.target as InputHTMLAttributes
    if (configRingingEnable.SetSource) {
        configRingingEnable.SetSource(input.value)
    }
}

export {
    ringingSettingForm,
    configRingingProductType,
    configRingingFirmwareVersion,
    configRingingEnable,
    SetRingingProductType,
    SetRingingFirmwareVersion,
    SetRingingEnableRinging,
}