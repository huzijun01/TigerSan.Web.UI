import Counter from '@/components/Counter.vue'
import InputPage from '@/pages/InputPage.vue'
import TablePage from '@/pages/TablePage.vue'
import { Icons } from '@/0_tigersan_ui/base'
import { NavBarModel } from '@/0_tigersan_ui/models'

let navBarModel = new NavBarModel({
    Folders: [
        {
            Icon: Icons.Chart_Line,
            Title: "图表",
            Buttons: [
                {
                    IsSelected: true,
                    Icon: Icons.Grid,
                    Title: "表格",
                    _component: TablePage
                },
            ]
        },
        {
            Title: "表单",
            Buttons: [
                {
                    Icon: Icons.VerificationCode,
                    Title: "输入框",
                    _component: InputPage
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

navBarModel.IsOpen.value = true
navBarModel.Width.value = 220

export default navBarModel