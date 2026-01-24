import { Icons } from '@/0_tigersan_ui/base';
import {
    NavBarModel,
    NavFolderModel,
    NavButtonModel
} from '@/0_tigersan_ui/models';
import Counter from '@/components/Counter.vue';

let navBarModel = new NavBarModel()

// 顶级文件夹:
let folder1 = navBarModel.GetFolder()
folder1.Icon.value = Icons.Table
folder1.Title.value = "测试"
navBarModel.AddFolder(folder1)

// 顶级按钮:

// 子文件夹:

// 子按钮:
let subButton1 = new NavButtonModel(navBarModel, folder1)
subButton1.Title.value = "Counter"
subButton1.Icon.value = Icons.Radar
subButton1._component = Counter
folder1.AddButton(subButton1)

let subButton2 = new NavButtonModel(navBarModel, folder1)
subButton2.Title.value = "空"
subButton2.Icon.value = Icons.Chart_Line
folder1.AddButton(subButton2)

export default navBarModel