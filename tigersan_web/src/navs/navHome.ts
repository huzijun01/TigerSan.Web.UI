import { Icons, NavFolderConfig } from '@/0_tigersan_ui/tigerui'
import { Authorities } from './Authorities'

export const navHome: NavFolderConfig = {
    Folders: [
        {
            Title: "业务类别 1",
            Icon: Icons.Folder_Linear,
            IsOpen: true,
            _authority: Authorities.BusinessFolder1,
            Buttons: [
                {
                    Title: "业务 1",
                    Icon: Icons.File_Linear,
                    IsSelected: true,
                    IsShowCloseButton: false,
                    _component: undefined,
                    _authority: Authorities.Business1,
                },
                {
                    Title: "业务 2",
                    Icon: Icons.File_Linear,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.Business2,
                },
            ]
        },
    ],
    Buttons: [
    ]
}