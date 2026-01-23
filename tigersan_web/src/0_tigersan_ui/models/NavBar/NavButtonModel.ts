import { ref } from 'vue'
import { Icons } from '@/0_tigersan_ui/base';
import { NavBarModel } from './NavBarModel'
import { NavFolderModel } from './NavFolderModel'
import { nanoid } from 'nanoid'

type NavButtonHandler = (buttonModel: NavButtonModel) => void

class NavButtonModel {
    //#region 【Fields】
    _id = nanoid()
    //#endregion 【Fields】

    //#region 【Properties】
    Icon = ref(Icons.File_Linear)
    Title = ref("null")
    IsSelected = ref(false)
    IsShowCloseButton = ref(true)
    IsShow = ref(true)
    NavBarModel: NavBarModel
    NavFolderModel: NavFolderModel
    //#endregion 【Properties】

    //#region 【Events】
    Clicked?: NavButtonHandler
    Checked?: NavButtonHandler
    //#endregion 【Events】

    //#region 【Ctor】
    constructor(
        navBarModel: NavBarModel,
        navFolderModel: NavFolderModel
    ) {
        this.NavBarModel = navBarModel
        this.NavFolderModel = navFolderModel
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    //#endregion 【Functions】
}

export {
    type NavButtonHandler,
    NavButtonModel
}