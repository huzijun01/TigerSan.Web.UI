import { ref } from 'vue'
import { Verify, FormModel, FormConfig, FormItemConfig, SwitchModel } from '@/0_tigersan_ui/tigerui'

/** “响铃设置”模型 */
class RingingSettingModel {
    /** 产品类型 */
    ProductType? = ''
    /** 固件版本 */
    FirmwareVersion? = ''
    /** 是否启用 */
    Enable = false
}

/** 组件模型 */
const enableSwitch = new SwitchModel()

/** “响铃设置”实例 */
const ringingSetting = new RingingSettingModel()
ringingSetting.ProductType = undefined
ringingSetting.FirmwareVersion = undefined

/** “产品类型”项目配置 */
const configProductType: FormItemConfig = {
    _propName: 'ProductType',
    PropText: '产品类型',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var ringingSetting = source as RingingSettingModel
        return Verify.IsNotUndefinedOrEmpty(ringingSetting.ProductType)
    }
}

/** “固件版本”项目配置 */
const configFirmwareVersion: FormItemConfig = {
    _propName: 'FirmwareVersion',
    PropText: '固件版本',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var ringingSetting = source as RingingSettingModel
        return Verify.IsNotUndefinedOrEmpty(ringingSetting.FirmwareVersion)
    }
}

/** “是否启用”项目配置 */
const configEnable: FormItemConfig = {
    _propName: 'Enable',
    PropText: '响铃设置',
    IsEquired: true,
    Target: enableSwitch.Value
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
        configProductType,
        configEnable,
        configFirmwareVersion,
    ]
}

/** “网关”表单模型 */
const ringingSettingForm = new FormModel(configGatewayForm)

export default {
    enableSwitch,
    ringingSettingForm,
    configProductType,
    configFirmwareVersion,
    configEnable,
}