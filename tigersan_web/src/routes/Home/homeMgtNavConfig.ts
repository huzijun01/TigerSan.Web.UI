import { Icons, NavFolderConfig } from '@/0_tigersan_ui/tigerui'
import StationMgtPage from '@/pages/StationMgtPage/StationMgtPage.vue'
import PersonMgtLabelPage from '@/pages/PersonMgtLabelPage/PersonMgtLabelPage.vue'
import AssetMgtLabelPage from '@/pages/AssetMgtLabelPage/AssetMgtLabelPage.vue'
import EnvSensorPage from '@/pages/EnvSensorPage/EnvSensorPage.vue'
import OperationRecordPage from '@/pages/OperationRecordPage/OperationRecordPage.vue'
import OperationRetryPage from '@/pages/OperationRetryPage/OperationRetryPage.vue'
import SystemSettingsPage from '@/pages/SystemSettingsPage/SystemSettingsPage.vue'

const homeMgtNavConfig: NavFolderConfig = {
    Folders: [
        {
            IsOpen: false,
            Title: "基站管理",
            Icon: Icons.Router,
            Buttons: [
                {
                    IsSelected: true,
                    Icon: Icons.Router,
                    Title: "基站管理",
                    _component: StationMgtPage
                },
            ]
        },
        {
            IsOpen: false,
            Title: "标签管理",
            Icon: Icons.Label_2,
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
                    Title: "环境标签",
                    Icon: Icons.Environment,
                    _component: EnvSensorPage
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
    homeMgtNavConfig
}