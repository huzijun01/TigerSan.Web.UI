import Counter from '@/components/Counter.vue'
import { Icons } from '@/0_tigersan_ui/base'
import { NavBarModel } from '@/0_tigersan_ui/models'

let navBarModel = new NavBarModel({
    Folders: [
        {
            Icon: Icons.Table,
            Title: "测试",
            Buttons: [
                {
                    Icon: Icons.Radar,
                    Title: "Counter",
                    _component: Counter
                },
                {
                    Icon: Icons.Chart_Line,
                    Title: "空",
                }
            ]
        }
    ]
})

export default navBarModel