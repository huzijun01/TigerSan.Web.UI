import { Icons } from '@/0_tigersan_ui/base'
import { NavBarModel } from '@/0_tigersan_ui/models'

let testNavBarModel = new NavBarModel({
    Folders: [
        {
            Title: "一级目录 1",
            Folders: [
                {
                    Title: "二级目录 1",
                    Buttons: [
                        {
                            Title: "按钮 1",
                        },
                        {
                            Title: "按钮 2",
                        }
                    ],
                },
                {
                    Title: "二级目录 2",
                    Buttons: [
                        {
                            Title: "按钮 3",
                        },
                        {
                            Title: "按钮 4",
                        }
                    ]
                },
            ],
            Buttons: [
                {
                    Title: "按钮 5",
                },
                {
                    Title: "按钮 6",
                }
            ]
        }
    ],
    Buttons: [
        {
            Icon: Icons.Covert,
            Title: "按钮 7",
        },
        {
            Icon: Icons.Add_PIC,
            Title: "按钮 8",
        }
    ]
})

export default testNavBarModel