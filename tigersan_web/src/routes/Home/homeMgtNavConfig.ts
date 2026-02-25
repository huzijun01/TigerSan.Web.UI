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
            Title: "设备管理",
            Icon: Icons.Server,
            Buttons: [
                {
                    Icon: '',
                    Title: "人员管理标签",
                    _component: PersonMgtLabelPage,
                },
                {
                    Icon: '',
                    Title: "资产管理标签",
                    _component: AssetMgtLabelPage,
                },
                {
                    Icon: '',
                    Title: "环境传感器",
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
                    Icon: '',
                    Title: "操作记录",
                    _component: OperationRecordPage
                },
                {
                    Icon: '',
                    Title: "操作重试",
                    _component: OperationRetryPage
                },
            ]
        }
    ],
    Buttons: [
        {
            IsSelected: true,
            Icon: Icons.Router,
            Title: "基站管理",
            _component: StationMgtPage
        },
        {
            Icon: Icons.Setting_Linear,
            Title: "系统设置",
            _component: SystemSettingsPage
        },
    ]
}

export {
    homeMgtNavConfig
}