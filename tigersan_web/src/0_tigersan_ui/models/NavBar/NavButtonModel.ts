import { ref, type Component } from 'vue'
import { nanoid } from 'nanoid'
import { Icons } from '@/0_tigersan_ui/base';
import { NavBarModel } from './NavBarModel'
import { NavFolderModel } from './NavFolderModel'

type NavButtonHandler = (buttonModel: NavButtonModel) => void

class NavButtonModel {
    //#region 【Fields】
    _id = nanoid()
    _component?: Component
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
        navFolderModel: NavFolderModel,
        component?: Component
    ) {
        this.NavBarModel = navBarModel
        this.NavFolderModel = navFolderModel
        this._component = component
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    //#endregion 【Functions】
}

export {
    type NavButtonHandler,
    NavButtonModel
}