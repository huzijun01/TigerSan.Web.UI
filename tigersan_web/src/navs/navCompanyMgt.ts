import { Icons, NavFolderConfig } from '@/0_tigersan_ui/tigerui'
import CompanyMgtPage from '@/pages/CompanyMgtPage/CompanyMgtPage.vue'

const navCompanyMgt: NavFolderConfig = {
    Folders: [
    ],
    Buttons: [
        {
            Title: "公司管理",
            Icon: Icons.Monitor,
            IsSelected: true,
            IsShowCloseButton: false,
            _component: CompanyMgtPage
        },
        {
            Title: "部门管理",
            Icon: Icons.Group,
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
            Title: "权限管理",
            Icon: Icons.Key_Tilted,
            IsSelected: false,
            _component: undefined
        },
    ]
}

export {
    navCompanyMgt
}