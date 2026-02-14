<template>
    <!-- 灯光设置: -->
    <DrawerBox :model="lightSettingDrawerBox">
        <Form>
            <FormRow>
                <FormItem :model="form.configProductType.ItemModel">
                    <Select :model="select.typeSelect"></Select>
                </FormItem>
                <FormItem :model="form.configFirmwareVersion.ItemModel">
                    <Select :model="select.firmwareSelect"></Select>
                </FormItem>
                <FormItem>
                    <div class="button-panel">
                        <button>恢复默认值</button>
                        <button>保存</button>
                    </div>
                </FormItem>
            </FormRow>
            <FormRow>
                <FormItem :model="form.configEnable.ItemModel">
                    <Switch :model="form.enableSwitch"></Switch>
                </FormItem>
            </FormRow>
            <FormRow>
                <FormItem :model="form.configFlash_Fast_On.ItemModel">
                    <input type="text" v-model="form.configFlash_Fast_On.Target.value">
                    <span> ms</span>
                </FormItem>
                <FormItem :model="form.configFlash_Fast_Off.ItemModel">
                    <input type="text" v-model="form.configFlash_Fast_Off.Target.value">
                    <span> ms</span>
                </FormItem>
            </FormRow>
        </Form>
    </DrawerBox>
</template>

<script lang="ts" setup>
import form from './LightSettingForm'
import select from './LightSettingSelect'
import {
    Form,
    Select,
    Switch,
    FormRow,
    FormItem,
    DrawerBox,
    DrawerBoxModel,
} from '@/tigerui'

// 抽屉盒子:
const lightSettingDrawerBox = new DrawerBoxModel()
lightSettingDrawerBox.Title.value = '设备亮灯'

// 选择框:
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