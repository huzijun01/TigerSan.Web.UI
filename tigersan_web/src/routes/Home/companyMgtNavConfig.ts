import { Icons, NavFolderConfig } from '@/0_tigersan_ui/tigerui'
import CompanyMgtPage from '@/pages/CompanyMgtPage/CompanyMgtPage.vue'


const companyMgtNavConfig: NavFolderConfig = {
    Folders: [
    ],
    Buttons: [
        {
            IsSelected: true,
            IsShowCloseButton: false,
            Icon: Icons.Monitor,
            Title: "公司管理",
            _component: CompanyMgtPage
        },
    ]
}

export {
    companyMgtNavConfig
}