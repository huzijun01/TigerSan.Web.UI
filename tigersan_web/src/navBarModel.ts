import GatewayMgtPage from '@/pages/GatewayMgtPage/GatewayMgtPage.vue'
import PersonMgtLabelPage from '@/pages/PersonMgtLabelPage/PersonMgtLabelPage.vue'
import AssetMgtLabelPage from '@/pages/AssetMgtLabelPage/AssetMgtLabelPage.vue'
import EnvSensorPage from '@/pages/EnvSensorPage/EnvSensorPage.vue'
import OperationRecordPage from '@/pages/OperationRecordPage/OperationRecordPage.vue'
import OperationRetryPage from '@/pages/OperationRetryPage/OperationRetryPage.vue'
import { Icons } from '@/0_tigersan_ui/base'
import { NavBarModel } from '@/0_tigersan_ui/models'

let navBarModel = new NavBarModel({
    Folders: [
        {
            Title: "设备管理",
            Icon: Icons.Memory,
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
            Icon: Icons.EQP,
            Title: "网关管理",
            _component: GatewayMgtPage
        },
        {
            Icon: Icons.Setting_Linear,
            Title: "系统设置",
        },
    ]
})

navBarModel.IsOpen.value = true
navBarModel.Width.value = 220

export default navBarModel