import { Icons, NavFolderConfig } from '@/0_tigersan_ui/tigerui'
import BaseStationMgtPage from '@/pages/Home/BaseStationMgtPage/BaseStationMgtPage.vue'
import PersonMgtLabelPage from '@/pages/Home/PersonMgtLabelPage/PersonMgtLabelPage.vue'
import AssetMgtLabelPage from '@/pages/Home/AssetMgtLabelPage/AssetMgtLabelPage.vue'
import EnvSensorPage from '@/pages/Home/EnvSensorPage/EnvSensorPage.vue'
import Terminal4gPage from '@/pages/Home/Terminal4gPage/Terminal4gPage.vue'
import OperationRecordPage from '@/pages/Home/OperationRecordPage/OperationRecordPage.vue'
import OperationRetryPage from '@/pages/Home/OperationRetryPage/OperationRetryPage.vue'
import SystemSettingsPage from '@/pages/Home/SystemSettingsPage/SystemSettingsPage.vue'

const navHomeMgt: NavFolderConfig = {
    Folders: [
        {
            Title: "基站管理",
            Icon: Icons.Router,
            IsOpen: true,
            Buttons: [
                {
                    Title: "基站管理",
                    Icon: Icons.Router,
                    IsSelected: true,
                    IsShowCloseButton: false,
                    _component: BaseStationMgtPage
                },
            ]
        },
        {
            Title: "标签管理",
            Icon: Icons.Label_2,
            IsOpen: false,
            Buttons: [
                {
                    Title: "人员管理标签",
                    Icon: Icons.Person,
                    _component: PersonMgtLabelPage,
                },
                {
                    Title: "资产管理标签",
                    Icon: Icons.Asset,
                    _component: AssetMgtLabelPage,
                },
                {
                    Title: "传感器标签",
                    Icon: Icons.Environment,
                    _component: EnvSensorPage
                },
            ]
        },
        {
            Title: "设备管理",
            Icon: Icons.Server,
            IsOpen: false,
            Buttons: [
                {
                    Title: "4G定位终端",
                    Icon: Icons.EQP,
                    _component: Terminal4gPage,
                },
            ]
        },
        {
            IsOpen: false,
            Title: "操作管理",
            Icon: Icons.ViewProcess,
            Buttons: [
                {
                    Title: "操作记录",
                    Icon: Icons.Time,
                    _component: OperationRecordPage
                },
                {
                    Title: "操作重试",
                    Icon: Icons.Refresh,
                    _component: OperationRetryPage
                },
            ]
        },
        {
            IsOpen: false,
            Title: "系统设置",
            Icon: Icons.Setting_Linear,
            Buttons: [
                {
                    Icon: Icons.Server,
                    Title: "设备设置",
                    _component: SystemSettingsPage
                },
            ]
        }
    ],
    Buttons: [
    ]
}

export {
    navHomeMgt
}