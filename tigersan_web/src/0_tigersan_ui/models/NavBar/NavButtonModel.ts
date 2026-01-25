import { computed, ref, type Component } from 'vue'
import { nanoid } from 'nanoid'
import { Icons } from '../../base';
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
    IsShow = ref(true)
    IsShowCloseButton = ref(true)
    IsSelected = computed(() => {
        return this.NavBarModel._SelectedButtonModel.value === this
    })
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