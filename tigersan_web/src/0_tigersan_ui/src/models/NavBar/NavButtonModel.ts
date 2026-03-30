import { computed, ref, type Component } from 'vue'
import { nanoid } from 'nanoid'
import { Icons } from '../../base'
import { NavBarModel } from './NavBarModel'
import { NavFolderModel } from './NavFolderModel'

type NavButtonHandler = (buttonModel: NavButtonModel) => void

class NavButtonModel {
    //#region 【Fields】
    _id = nanoid()
    _component?: Component
    //#endregion 【Fields】

    //#region 【Properties】
    /** 图标 */
    Icon = ref(Icons.File_Linear)
    /** 标题 */
    Title = ref("null")
    /** 是否显示 */
    IsShow = ref(true)
    /** 是否显示关闭按钮 */
    IsShowCloseButton = ref(true)
    /** 是否被选中 */
    IsSelected = computed(() => {
        return this.NavBarModel._SelectedButtonModel.value === this
    })
    /** 所属“导航栏”模型 */
    NavBarModel: NavBarModel
    /** 所属“目录”模型 */
    ParentFolderModel: NavFolderModel
    //#endregion 【Properties】

    //#region 【Events】
    /** 点击后 */
    Clicked?: NavButtonHandler
    /** 选中后 */
    Checked?: NavButtonHandler
    //#endregion 【Events】

    //#region 【Ctor】
    constructor(
        navModel: NavBarModel,
        navFolderModel: NavFolderModel,
        component?: Component
    ) {
        this.NavBarModel = navModel
        this.ParentFolderModel = navFolderModel
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