<template>
    <!-- 预警设置: -->
    <DrawerBox :model="alarmSettingDrawerBox">
        <Form>
            <FormRow>
                <FormItem :model="form.configBatteryAlarmRate.ItemModel">
                    <input type="text" class="num" v-model="form.configBatteryAlarmRate.Target.value">
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
                <FormItem :model="form.configEqpOfflineMinutes.ItemModel">
                    <input type="text" class="num" v-model="form.configEqpOfflineMinutes.Target.value">
                    <span> 分钟</span>
                </FormItem>
                <FormItem :model="form.configEqpOfflineSeconds.ItemModel">
                    <input type="text" class="num" v-model="form.configEqpOfflineSeconds.Target.value">
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
</template>

<script lang="ts" setup>
import form from './AlarmSettingForm'
import {
    Form,
    FormRow,
    FormItem,
    DrawerBox,
    DrawerBoxModel,
} from '@/0_tigersan_ui/tigerui'

// 抽屉盒子:
const alarmSettingDrawerBox = new DrawerBoxModel()
alarmSettingDrawerBox.Title.value = '预警设置'
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

    .num{
        width: 100px;
    }
}
</style>