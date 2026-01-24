import { Icons } from '@/0_tigersan_ui/base';
import {
    NavBarModel,
    NavFolderModel,
    NavButtonModel
} from '@/0_tigersan_ui/models';

let testNavBarModel = new NavBarModel()

// 顶级文件夹:
let folder1 = testNavBarModel.GetFolder()
folder1.Icon.value = Icons.Table
folder1.Title.value = "顶级文件夹 1"
testNavBarModel.AddFolder(folder1)

// 顶级按钮:
let btn1 = testNavBarModel.GetButton()
btn1.Icon.value = Icons.Covert
btn1.Title.value = "顶级按钮 1"
testNavBarModel.AddButton(btn1)

let btn2 = testNavBarModel.GetButton()
btn2.Icon.value = Icons.Add_PIC
btn2.Title.value = "顶级按钮 2"
testNavBarModel.AddButton(btn2)

// 子文件夹:
let subFolder1 = new NavFolderModel(testNavBarModel)
subFolder1.Title.value = "子文件夹 1"
folder1.AddFolder(subFolder1)

// 子按钮:
let subButton1 = new NavButtonModel(testNavBarModel, subFolder1)
subButton1.Title.value = "子文件 1"
subButton1.Icon.value = Icons.Radar
subFolder1.AddButton(subButton1)

let subButton2 = new NavButtonModel(testNavBarModel, subFolder1)
subButton2.Title.value = "子文件 2"
subButton2.Icon.value = Icons.Chart_Line
subFolder1.AddButton(subButton2)

let subButton3 = new NavButtonModel(testNavBarModel, subFolder1)
subButton3.Title.value = "子文件 3"
subButton3.Icon.value = Icons.Global_Linear
subFolder1.AddButton(subButton3)

export default testNavBarModel