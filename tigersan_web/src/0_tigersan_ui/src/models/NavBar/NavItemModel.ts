import { computed, ref } from "vue"
import { nanoid } from 'nanoid'
import { Icons } from "../../base"
import { NavBarModel } from './NavBarModel'
import { AuthorityVerify } from "../Authority/AuthorityVerify"

export class NavItemModel {
    //#region 【Fields】
    /** ID */
    readonly _id = nanoid()
    /** 权限 */
    _authority?: AuthorityVerify
    //#endregion 【Fields】

    //#region 【Properties】
    /** 图标 */
    readonly Icon = ref(Icons.Folder_Linear)
    /** 标题 */
    readonly Title = ref("null")
    /** 是否“显示” */
    readonly IsShow = ref(true)
    /** 所属“导航栏”模型 */
    readonly NavBarModel: NavBarModel
    /** 是否“允许显示” */
    readonly IsAllowShow = computed(() => this.IsShow.value && this.IsHasAuthority.value)
    /** 是否“具有权限” */
    readonly IsHasAuthority = computed(() => !this._authority || this._authority.IsEnable.value)
    //#endregion 【Properties】

    constructor(navModel: NavBarModel) {
        this.NavBarModel = navModel
    }
}