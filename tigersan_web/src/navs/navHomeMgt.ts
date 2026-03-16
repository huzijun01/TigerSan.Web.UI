import { Icons, NavFolderConfig } from '@/0_tigersan_ui/tigerui'

const navHomeMgt: NavFolderConfig = {
    Folders: [
        {
            Title: "业务类别 1",
            Icon: Icons.Folder_Linear,
            IsOpen: true,
            Buttons: [
                {
                    Title: "业务 1",
                    Icon: Icons.File_Linear,
                    IsSelected: true,
                    IsShowCloseButton: false,
                    _component: undefined
                },
                {
                    Title: "业务 2",
                    Icon: Icons.File_Linear,
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
    navHomeMgt
}