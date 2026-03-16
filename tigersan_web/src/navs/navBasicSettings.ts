import { Icons, NavFolderConfig } from '@/0_tigersan_ui/tigerui'
import CompanyMgtPage from '@/pages/BasicSettings/CompanyMgtPage/CompanyMgtPage.vue'
import BaseStationMgtPage from '@/pages/Home/BaseStationMgtPage/BaseStationMgtPage.vue'
import PersonMgtTagPage from '@/pages/Home/PersonMgtTagPage/PersonMgtTagPage.vue'
import AssetMgtTagPage from '@/pages/Home/AssetMgtTagPage/AssetMgtTagPage.vue'
import EnvSensorPage from '@/pages/Home/EnvSensorPage/EnvSensorPage.vue'
import Terminal4gPage from '@/pages/Home/Terminal4gPage/Terminal4gPage.vue'
import OperationRecordPage from '@/pages/Home/OperationRecordPage/OperationRecordPage.vue'
import OperationRetryPage from '@/pages/Home/OperationRetryPage/OperationRetryPage.vue'
import SystemSettingsPage from '@/pages/Home/SystemSettingsPage/SystemSettingsPage.vue'

const navBasicSettings: NavFolderConfig = {
    Folders: [
        {
            Title: "基础设置",
            Icon: Icons.Router,
            IsOpen: true,
            Buttons: [
                {
                    Title: "组织机构",
                    Icon: Icons.Monitor,
                    IsSelected: true,
                    IsShowCloseButton: false,
                    _component: CompanyMgtPage
                },
                {
                    Title: "角色管理",
                    Icon: Icons.Group,
                    IsSelected: false,
                    _component: undefined
                },
                {
                    Title: "权限管理",
                    Icon: Icons.Key_Tilted,
                    IsSelected: false,
                    _component: undefined
                },
                {
                    Title: "人员管理",
                    Icon: Icons.Person,
                    IsSelected: false,
                    _component: undefined
                },
                {
                    Title: "场地管理",
                    Icon: Icons.Building_1,
                    IsSelected: false,
                    _component: undefined
                },
            ]
        },
        {
            Title: "基站管理",
            Icon: Icons.Router,
            IsOpen: false,
            Buttons: [
                {
                    Title: "基站管理",
                    Icon: Icons.Router,
                    IsSelected: false,
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
                    _component: PersonMgtTagPage,
                },
                {
                    Title: "资产管理标签",
                    Icon: Icons.Asset,
                    _component: AssetMgtTagPage,
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
                {
                    Title: "报警管理",
                    Icon: Icons.Bell,
                    IsSelected: false,
                    _component: undefined
                },
            ]
        },
    ],
    Buttons: [
    ]
}

export {
    navBasicSettings
}