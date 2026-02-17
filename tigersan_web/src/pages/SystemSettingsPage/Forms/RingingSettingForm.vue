<template>
    <!-- 响铃设置: -->
    <DrawerBox :model="ringingSettingDrawerBox">
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
        </Form>
    </DrawerBox>
</template>

<script lang="ts" setup>
import form from './RingingSettingForm'
import select from './RingingSettingSelect'
import {
    Form,
    Select,
    Switch,
    FormRow,
    FormItem,
    DrawerBox,
    DrawerBoxModel,
} from '@/0_tigersan_ui/tigerui'

const ringingSettingDrawerBox = new DrawerBoxModel()
ringingSettingDrawerBox.Title.value = '响铃设置'
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