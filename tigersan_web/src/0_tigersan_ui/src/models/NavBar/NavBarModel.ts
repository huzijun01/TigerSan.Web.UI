import { ref, shallowRef, shallowReactive, type ShallowReactive } from 'vue'
import type { NumberAction } from '../../types'
import { NavButtonModel, type NavButtonHandler } from './NavButtonModel'
import { NavFolderModel, type NavFolderHandler } from './NavFolderModel'
import { type NavFolderConfig, CreateNavFolderModel } from './NavConfig'

export type TryNavButtonHandler = (buttonModel: NavButtonModel | undefined) => void

export class NavBarModel {
    //#region 【Fields】
    static readonly _defaultFolderModel = new NavFolderModel(new NavBarModel())
    static readonly _defaultButtonModel = new NavButtonModel(new NavBarModel(), new NavFolderModel(new NavBarModel()))

    /** 获取“导航栏”宽度
     * （NavBar内部会自动添加回调） */
    _getNavWidth?: NumberAction

    /** 获取“文件夹”高度
     * （NavBar内部会自动添加回调） */
    _getFolderHeight?: NumberAction

    /** 获取“按钮”高度
     * （NavBar内部会自动添加回调） */
    _getButtonHeight?: NumberAction

    /** “选中按钮”改变后委托
     * （PageView内部会自动添加回调） */
    _onSelectedButtonModelChanged: TryNavButtonHandler | undefined
    //#endregion 【Fields】

    //#region 【Properties】
    /** 宽度 */
    Width = ref(220)

    /** 是否打开 */
    IsOpen = ref(true)

    /** 文件夹模型 */
    FolderModel: NavFolderModel = new NavFolderModel(this)

    /** 已打开的“按钮模型”集合 */
    OpenedButtonModels: ShallowReactive<NavButtonModel[]> = shallowReactive([])

    /** 选中的“按钮模型”
     * （会触发“选中状态”更新） */
    get SelectedButtonModel(): NavButtonModel | undefined {
        return this._SelectedButtonModel.value
    }
    set SelectedButtonModel(value: NavButtonModel | undefined) {
        if (value === this._SelectedButtonModel.value) return
        this._SelectedButtonModel.value = value
        this._onSelectedButtonModelChanged?.(value)
    }
    /** 用于IsSelected计算属性 
     * （请勿直接修改） */
    _SelectedButtonModel = shallowRef<NavButtonModel | undefined>()
    //#endregion 【Properties】

    //#region 【Events】
    /** 点击“导航栏开关”按钮 */
    btnNavSwitch_Click() {
        this.IsOpen.value = !this.IsOpen.value;
    }
    //#endregion 【Events】

    //#region 【Ctor】
    constructor(folder?: NavFolderConfig) {
        if (!folder) return
        this.Init(folder)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 递归操作“项目”集合 */
    RecursivelyOperateItems(
        fnFolder: NavFolderHandler | undefined,
        fnButton: NavButtonHandler | undefined = undefined,
        isIncludeNotShowFolder: boolean = true) {
        NavFolderModel.RecursivelyOperateSubItems(this.FolderModel, fnFolder, fnButton, isIncludeNotShowFolder)
    }

    /** 初始化 */
    Init(folder: NavFolderConfig) {
        // 状态:
        this.OpenedButtonModels.splice(0)
        this.SelectedButtonModel = undefined
        // 内容:
        let folderModel = CreateNavFolderModel(this, folder)
        this.FolderModel.FolderModels.splice(0)
        this.FolderModel.FolderModels.push(...folderModel.FolderModels)
        this.FolderModel.ButtonModels.splice(0)
        this.FolderModel.ButtonModels.push(...folderModel.ButtonModels)
        folderModel.FolderModels.forEach(f => f.ParentFolderModel = this.FolderModel)
        folderModel.ButtonModels.forEach(b => b.ParentFolderModel = this.FolderModel)
        this.UpdateHeight()
    }

    /** 获取“文件夹” */
    GetFolder() {
        return new NavFolderModel(this)
    }

    /** 获取“按钮” */
    GetButton() {
        return new NavButtonModel(this, this.FolderModel)
    }

    /** 添加“文件夹” */
    AddFolder(folderModel: NavFolderModel) {
        this.FolderModel.FolderModels.push(folderModel)
    }

    /** 添加“按钮” */
    AddButton(buttonModel: NavButtonModel) {
        this.FolderModel.ButtonModels.push(buttonModel)
    }

    /** 更新“高度” */
    UpdateHeight() {
        NavFolderModel.RecursivelyOperateSubItems(
            this.FolderModel,
            folderModel => {
                folderModel.UpdateHeight()
            })
    }
    //#endregion 【Functions】
}