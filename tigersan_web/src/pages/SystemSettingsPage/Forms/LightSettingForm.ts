import { ref } from 'vue'
import { FormModel, FormConfig, FormItemConfig } from '@/0_tigersan_ui/models'
import { IsNotUndefinedOrEmpty, IsWithinRange } from '@/0_tigersan_ui/helpers'

/** “灯光设置”模型 */
class LightSettingModel {
    /** 产品类型 */
    ProductType? = ''
    /** 固件版本 */
    FirmwareVersion? = ''
    /** 是否启用 */
    Enable = 0
    /** 闪烁时长（快、亮灯） */
    Flash_Fast_On = 200
    /** 闪烁时长（快、灭灯） */
    Flash_Fast_Off = 200
    /** 闪烁时长（较快、亮灯） */
    Flash_Faster_On = 200
    /** 闪烁时长（较快、灭灯） */
    Flash_Faster_Off = 200
    /** 闪烁时长（中、亮灯） */
    Flash_Medium_On = 200
    /** 闪烁时长（中、灭灯） */
    Flash_Medium_Off = 200
}

/** “灯光设置”实例 */
const lightSetting = new LightSettingModel()
lightSetting.ProductType = undefined
lightSetting.FirmwareVersion = undefined
lightSetting.Enable = 20

/** “产品类型”项目配置 */
const configProductType: FormItemConfig = {
    _propName: 'ProductType',
    PropText: '产品类型',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var lightSetting = source as LightSettingModel
        return IsNotUndefinedOrEmpty(lightSetting.ProductType)
    }
}

/** “固件版本”项目配置 */
const configFirmwareVersion: FormItemConfig = {
    _propName: 'FirmwareVersion',
    PropText: '固件版本',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var lightSetting = source as LightSettingModel
        return IsNotUndefinedOrEmpty(lightSetting.FirmwareVersion)
    }
}

/** “是否启用”项目配置 */
const configEnable: FormItemConfig = {
    _propName: 'Enable',
    PropText: '灯光设置',
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var lightSetting = source as LightSettingModel
        return IsWithinRange(lightSetting.Enable, 1, 59)
    }
}

/** “快闪亮灯”项目配置 */
const configFlash_Fast_On: FormItemConfig = {
    _propName: 'Flash_Fast_On',
    PropText: '亮灯',
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var lightSetting = source as LightSettingModel
        return IsWithinRange(lightSetting.Flash_Fast_On, 200, 65000)
    }
}

/** “快闪灭灯”项目配置 */
const configFlash_Fast_Off: FormItemConfig = {
    _propName: 'Flash_Fast_Off',
    PropText: '灭灯',
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var lightSetting = source as LightSettingModel
        return IsWithinRange(lightSetting.Flash_Fast_Off, 200, 65000)
    }
}

/** “增”源数据获取方法 */
const GetSource = () => {
    return lightSetting
}

/** “灯光设置”表单配置 */
let configLightSettingForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: GetSource,
    _itemConfigs: [
        configProductType,
        configEnable,
        configFirmwareVersion,
        configFlash_Fast_On,
        configFlash_Fast_Off,
    ]
}

/** “灯光设置”表单模型 */
const lightSettingForm = new FormModel(configLightSettingForm)

export default {
    lightSettingForm,
    configProductType,
    configFirmwareVersion,
    configEnable,
    configFlash_Fast_On,
    configFlash_Fast_Off,
}