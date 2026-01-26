import Counter from '@/components/Counter.vue'
import TablePage from '@/components/TablePage.vue'
import { Icons } from '@/0_tigersan_ui/base'
import { NavBarModel } from '@/0_tigersan_ui/models'

let navBarModel = new NavBarModel({
    Folders: [
        {
            Icon: Icons.Chart_Line,
            Title: "图表",
            Buttons: [
                {
                    Icon: Icons.Grid,
                    Title: "表格",
                    _component: TablePage
                },
            ]
        },
        {
            Title: "其它",
            Buttons: [
                {
                    Icon: Icons.VerificationCode,
                    Title: "Counter",
                    _component: Counter
                },
            ]
        }
    ]
})

export default navBarModel