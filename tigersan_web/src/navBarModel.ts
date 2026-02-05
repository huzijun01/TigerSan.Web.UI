import GatewayMgtPage from '@/pages/GatewayMgtPage/GatewayMgtPage.vue'
import PersonMgtLabelPage from '@/pages/PersonMgtLabelPage/PersonMgtLabelPage.vue'
import { Icons } from '@/0_tigersan_ui/base'
import { NavBarModel } from '@/0_tigersan_ui/models'

let navBarModel = new NavBarModel({
    Folders: [
        {
            Title: "设备管理",
            Icon: Icons.Memory,
            Buttons: [
                {
                    IsSelected: true,
                    Icon: '',
                    Title: "人员管理标签",
                    _component: PersonMgtLabelPage,
                },
                {
                    Icon: '',
                    Title: "资产管理标签",
                },
                {
                    Icon: '',
                    Title: "环境传感器",
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
                },
                {
                    Icon: '',
                    Title: "操作重试",
                },
            ]
        }
    ],
    Buttons: [
        {
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