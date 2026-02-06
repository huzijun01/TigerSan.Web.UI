<template>
    <PageCard>
        <div class="settings-page">
            <!-- 预警设置: -->
            <DrawerBox :model="alarmSettingDrawerBox">
                <Form>
                    <FormRow>
                        <FormItem :model="configBatteryAlarmRate.ItemModel">
                            <input type="text" :value="configBatteryAlarmRate.Target.value"
                                v-on:input="SetBatteryAlarmRate">
                            <span> %</span>
                        </FormItem>
                        <FormItem>
                        </FormItem>
                        <FormItem>
                            <div class="button-panel">
                                <button>恢复默认值</button>
                                <button>保存</button>
                            </div>
                        </FormItem>
                    </FormRow>
                    <FormRow>
                        <FormItem :model="configEqpOfflineMinutes.ItemModel">
                            <input type="text" :value="configEqpOfflineMinutes.Target.value"
                                v-on:input="SetEqpOfflineMinutes">
                            <span> 分钟</span>
                        </FormItem>
                        <FormItem :model="configEqpOfflineSeconds.ItemModel">
                            <input type="text" :value="configEqpOfflineSeconds.Target.value"
                                v-on:input="SetEqpOfflineSeconds">
                            <span> 秒</span>
                        </FormItem>
                        <FormItem>
                            <div class="button-panel">
                                <button>恢复默认值</button>
                                <button>保存</button>
                            </div>
                        </FormItem>
                    </FormRow>
                </Form>
            </DrawerBox>

            <!-- 灯光设置: -->
            <DrawerBox :model="lightSettingDrawerBox">
                <Form>
                    <FormRow>
                        <FormItem :model="configLightProductType.ItemModel">
                            <Select :model="lightTypeSelect"></Select>
                        </FormItem>
                        <FormItem :model="configLightFirmwareVersion.ItemModel">
                            <Select :model="lightFirmwareSelect"></Select>
                        </FormItem>
                        <FormItem>
                            <div class="button-panel">
                                <button>恢复默认值</button>
                                <button>保存</button>
                            </div>
                        </FormItem>
                    </FormRow>
                    <FormRow>
                        <FormItem :model="configFlash_Fast_On.ItemModel">
                            <input type="text" :value="configFlash_Fast_On.Target.value" v-on:input="SetFlash_Fast_On">
                            <span> ms</span>
                        </FormItem>
                        <FormItem :model="configFlash_Fast_Off.ItemModel">
                            <input type="text" :value="configFlash_Fast_Off.Target.value"
                                v-on:input="SetFlash_Fast_Off">
                            <span> ms</span>
                        </FormItem>
                    </FormRow>
                </Form>
            </DrawerBox>

            <!-- 响铃设置: -->
            <DrawerBox :model="ringingSettingDrawerBox">
                <Form>
                    <FormRow>
                        <FormItem :model="configRingingProductType.ItemModel">
                            <Select :model="ringingTypeSelect"></Select>
                        </FormItem>
                        <FormItem :model="configRingingFirmwareVersion.ItemModel">
                            <Select :model="ringingFirmwareSelect"></Select>
                        </FormItem>
                        <FormItem>
                            <div class="button-panel">
                                <button>恢复默认值</button>
                                <button>保存</button>
                            </div>
                        </FormItem>
                    </FormRow>
                </Form>
            </DrawerBox>
        </div>
    </PageCard>
</template>

<script lang="ts" setup>
import {
    Select,
    Form,
    FormRow,
    FormItem,
    PageCard,
    DrawerBox,
} from '@/0_tigersan_ui/components'
import {
    alarmSettingForm,
    configBatteryAlarmRate,
    configEqpOfflineMinutes,
    configEqpOfflineSeconds,
    SetBatteryAlarmRate,
    SetEqpOfflineMinutes,
    SetEqpOfflineSeconds,
} from './AlarmSettingForm'
import {
    lightSettingForm,
    configLightProductType,
    configLightFirmwareVersion,
    configEnable,
    configFlash_Fast_On,
    configFlash_Fast_Off,
    SetLightProductType,
    SetLightFirmwareVersion,
    SetEnableLight,
    SetFlash_Fast_On,
    SetFlash_Fast_Off,
} from './LightSettingForm'
import {
    ringingSettingForm,
    configRingingProductType,
    configRingingFirmwareVersion,
    configRingingEnable,
} from './RingingSettingForm'
import {
    SelectModel,
    DrawerBoxModel,
} from '@/0_tigersan_ui/models';

// 抽屉盒子:
const alarmSettingDrawerBox = new DrawerBoxModel()
alarmSettingDrawerBox.Title.value = '预警设置'

const lightSettingDrawerBox = new DrawerBoxModel()
lightSettingDrawerBox.Title.value = '设备亮灯'

const ringingSettingDrawerBox = new DrawerBoxModel()
ringingSettingDrawerBox.Title.value = '响铃设置'

const types = [
    'MBT02可连接资产标签',
    'MBT02资产中继器',
]

const firmwares: [] = [
]

// 选择框:
const lightTypeSelect = new SelectModel()
lightTypeSelect.Width.value = 300
lightTypeSelect.Placeholder.value = '请选择'
lightTypeSelect.Value.value = undefined
lightTypeSelect.Items.push(...types)

const lightFirmwareSelect = new SelectModel()
lightFirmwareSelect.Width.value = 120
lightFirmwareSelect.Placeholder.value = '请选择'
lightFirmwareSelect.Value.value = undefined
lightFirmwareSelect.Items.push(...firmwares)

const ringingTypeSelect = new SelectModel()
ringingTypeSelect.Width.value = 300
ringingTypeSelect.Placeholder.value = '请选择'
ringingTypeSelect.Value.value = undefined
ringingTypeSelect.Items.push(...types)

const ringingFirmwareSelect = new SelectModel()
ringingFirmwareSelect.Width.value = 120
ringingFirmwareSelect.Placeholder.value = '请选择'
ringingFirmwareSelect.Value.value = undefined
ringingFirmwareSelect.Items.push(...firmwares)

</script>

<style lang="less" scoped>
.settings-page {
    display: flex;
    flex-direction: column;
    height: 100%; // 必须设置父容器高度

    .button-panel {
        &>button:not(:last-child) {
            margin-right: 10px;
        }
    }
}
</style>