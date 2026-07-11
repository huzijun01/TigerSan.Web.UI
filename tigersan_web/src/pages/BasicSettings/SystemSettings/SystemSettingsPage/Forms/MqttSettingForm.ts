import { ref } from 'vue'
import { loading, MyActionResult, ObjectHelper, SwitchModel } from '@/0_tigersan_ui/tigerui'
import { MqttHelper } from '@/models'

/** “预警设置”模型 */
class MqttSettingModel {
}

export class MqttSettingForm {
    // readonly watch = WatchBehavior()
    readonly mqttSetting = new MqttSettingModel()
    /** 是否“正在监听” */
    readonly switchIsListening = new SwitchModel()
    /** 是否“正在监听” */
    readonly LastReportTime = ref('')

    constructor() {
    }

    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            const resIsListening = await MqttHelper.IsListening()
            if (resIsListening.data === undefined) {
                MyActionResult.ShowResult(resIsListening)
            } else {
                this.switchIsListening.Value.value = resIsListening.data
            }

            const resLastReportTime = await MqttHelper.LastReportTime()
            if (resLastReportTime.data === undefined) {
                MyActionResult.ShowResult(resLastReportTime)
            } else {
                this.LastReportTime.value = ObjectHelper.GetDateString(resLastReportTime.data)
            }
        } finally {
            loading.IsShow.value = false
        }
    }

    readonly Save = async () => {
        try {
            loading.IsShow.value = true

            const res = this.switchIsListening.Value.value
                ? await MqttHelper.Start()
                : await MqttHelper.Stop()
            MyActionResult.ShowResult(res)
        } finally {
            loading.IsShow.value = false
        }
    }
}