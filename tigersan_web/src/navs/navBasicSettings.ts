import { Icons, NavFolderConfig } from '@/0_tigersan_ui/tigerui'
// BasicSettings:
import CompanyMgtPage from '@/pages/BasicSettings/BasicSettings/CompanyMgtPage/CompanyMgtPage.vue'
import DepartmentMgtPage from '@/pages/BasicSettings/BasicSettings/DepartmentMgtPage/DepartmentMgtPage.vue'
import PersonMgtPage from '@/pages/BasicSettings/BasicSettings/PersonMgtPage/PersonMgtPage.vue'
import RoleMgtPage from '@/pages/BasicSettings/BasicSettings/RoleMgtPage/RoleMgtPage.vue'
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
import { Authorities } from './Authorities'

export const navBasicSettings: NavFolderConfig = {
    Folders: [
        {
            Title: "基础设置",
            Icon: Icons.Setting_Linear,
            IsOpen: true,
            _authority: Authorities.BasicSettingsFolder,
            Buttons: [
                {
                    Title: "组织机构",
                    Icon: Icons.Monitor,
                    IsSelected: true,
                    IsShowCloseButton: false,
                    _component: CompanyMgtPage,
                    _authority: Authorities.CompanyMgtPage,
                },
                {
                    Title: "部门管理",
                    Icon: Icons.Group,
                    IsSelected: false,
                    _component: DepartmentMgtPage,
                    _authority: Authorities.DepartmentMgtPage,
                },
                {
                    Title: "角色管理",
                    Icon: Icons.Necktie,
                    IsSelected: false,
                    _component: RoleMgtPage,
                    _authority: Authorities.RoleMgtPage,
                },
                {
                    Title: "人员管理",
                    Icon: Icons.Person,
                    IsSelected: false,
                    _component: PersonMgtPage,
                    _authority: Authorities.PersonMgtPage,
                },
                {
                    Title: "场地管理",
                    Icon: Icons.Building_1,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.PlaceMgt,
                },
            ]
        },
        {
            Title: "基站管理",
            Icon: Icons.Router,
            IsOpen: false,
            _authority: Authorities.BaseStationMgtFolder,
            Buttons: [
                {
                    Title: "基站管理",
                    Icon: Icons.Router,
                    IsSelected: false,
                    _component: BaseStationMgtPage,
                    _authority: Authorities.BaseStationMgtPage,
                },
            ]
        },
        {
            Title: "标签管理",
            Icon: Icons.Label_2,
            IsOpen: false,
            _authority: Authorities.TagMgtFolder,
            Buttons: [
                {
                    Title: "人员管理标签",
                    Icon: Icons.Person,
                    _component: PersonMgtTagPage,
                    _authority: Authorities.PersonMgtTagPage,
                },
                {
                    Title: "资产管理标签",
                    Icon: Icons.Asset,
                    _component: AssetMgtTagPage,
                    _authority: Authorities.AssetMgtTagPage,
                },
                {
                    Title: "传感器标签",
                    Icon: Icons.Environment,
                    _component: EnvSensorPage,
                    _authority: Authorities.EnvSensorPage,
                },
            ]
        },
        {
            Title: "设备管理",
            Icon: Icons.Server,
            IsOpen: false,
            _authority: Authorities.EqpMgtFolder,
            Buttons: [
                {
                    Title: "4G定位终端",
                    Icon: Icons.EQP,
                    _component: Terminal4gPage,
                    _authority: Authorities.Terminal4gPage,
                },
            ]
        },
        {
            IsOpen: false,
            Title: "操作管理",
            Icon: Icons.ViewProcess,
            _authority: Authorities.OperationMgtFolder,
            Buttons: [
                {
                    Title: "操作记录",
                    Icon: Icons.Time,
                    _component: OperationRecordPage,
                    _authority: Authorities.OperationRecordPage,
                },
                {
                    Title: "操作重试",
                    Icon: Icons.Refresh,
                    _component: OperationRetryPage,
                    _authority: Authorities.OperationRetryPage,
                },
            ]
        },
        {
            IsOpen: false,
            Title: "系统设置",
            Icon: Icons.Setting_Linear,
            _authority: Authorities.SystemSettingsFolder,
            Buttons: [
                {
                    Icon: Icons.Server,
                    Title: "设备设置",
                    _component: SystemSettingsPage,
                    _authority: Authorities.SystemSettingsPage,
                },
                {
                    Title: "报警管理",
                    Icon: Icons.Bell,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.AlarmMgtPage,
                },
            ]
        },
    ],
    Buttons: [
    ]
}