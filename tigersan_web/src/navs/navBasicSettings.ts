import { Icons, NavFolderConfig } from '@/0_tigersan_ui/tigerui'
// BasicSettings:
import CompanyMgtPage from '@/pages/BasicSettings/BasicSettings/CompanyMgtPage/CompanyMgtPage.vue'
import DepartmentMgtPage from '@/pages/BasicSettings/BasicSettings/DepartmentMgt/DepartmentMgtPage.vue'
import PersonMgtPage from '@/pages/BasicSettings/BasicSettings/PersonMgtPage/PersonMgtPage.vue'
import RoleMgtPage from '@/pages/BasicSettings/BasicSettings/RoleMgt/RoleMgtPage.vue'
// BaseStationMgt:
import BaseStationMgtPage from '@/pages/BasicSettings/BaseStationMgt/BaseStationMgtPage/BaseStationMgtPage.vue'
// TagMgt:
import PersonMgtTagPage from '@/pages/BasicSettings/TagMgt/PersonMgtTagPage/PersonMgtTagPage.vue'
import AssetMgtTagPage from '@/pages/BasicSettings/TagMgt/AssetMgtTagPage/AssetMgtTagPage.vue'
import EnvSensorPage from '@/pages/BasicSettings/TagMgt/EnvSensorPage/EnvSensorPage.vue'
// TerminalMgt:
import Terminal4gPage from '@/pages/BasicSettings/TerminalMgt/Terminal4gPage/Terminal4gPage.vue'
// OperationMgt:
import OperationRecordPage from '@/pages/BasicSettings/OperationMgt/OperationRecordPage/OperationRecordPage.vue'
import OperationRetryPage from '@/pages/BasicSettings/OperationMgt/OperationRetryPage/OperationRetryPage.vue'
// SystemSettings:
import SystemSettingsPage from '@/pages/BasicSettings/SystemSettings/SystemSettingsPage/SystemSettingsPage.vue'

const navBasicSettings: NavFolderConfig = {
    Folders: [
        {
            Title: "基础设置",
            Icon: Icons.Setting_Linear,
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
                    Title: "部门管理",
                    Icon: Icons.Group,
                    IsSelected: false,
                    _component: DepartmentMgtPage
                },
                {
                    Title: "角色管理",
                    Icon: Icons.Necktie,
                    IsSelected: false,
                    _component: RoleMgtPage
                },
                {
                    Title: "人员管理",
                    Icon: Icons.Person,
                    IsSelected: false,
                    _component: PersonMgtPage
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