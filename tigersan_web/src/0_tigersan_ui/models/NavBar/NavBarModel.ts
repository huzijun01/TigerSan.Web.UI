import { ref, shallowReactive, type ShallowReactive } from 'vue'
import { NavButtonModel } from './NavButtonModel'
import { NavFolderModel } from './NavFolderModel'
import type { TryNumberAction } from '@/0_tigersan_ui/base'

type TryNavButtonHandler = (buttonModel: NavButtonModel | undefined) => void

class NavBarModel {
    //#region 【Fields】
    static readonly _defaultFolderModel = new NavFolderModel(new NavBarModel())
    static readonly _defaultButtonModel = new NavButtonModel(new NavBarModel(), new NavFolderModel(new NavBarModel()))

    /** 获取“文件夹”高度
     * （NavBar内部会自动添加回调） */
    _getFolderHeight: TryNumberAction = undefined

    /** 获取“按钮”高度
     * （NavBar内部会自动添加回调） */
    _getButtonHeight: TryNumberAction = undefined

    /** “选中按钮”改变后委托
     * （PageView内部会自动添加回调） */
    _onSelectedButtonModelChanged: TryNavButtonHandler | undefined
    //#endregion 【Fields】

    //#region 【Properties】
    /** 宽度 */
    Width = ref(200)

    /** 是否打开 */
    IsOpen = ref(true)

    /** 文件夹模型 */
    FolderModel: NavFolderModel

    /** 已打开的“按钮模型”集合 */
    OpenedButtonModels: ShallowReactive<NavButtonModel[]> = shallowReactive([])

    /** 选中的“按钮模型”
     * （会触发“选中状态”更新） */
    get SelectedButtonModel(): NavButtonModel | undefined {
        return this._SelectedButtonModel
    }
    set SelectedButtonModel(value: NavButtonModel | undefined) {
        this._SelectedButtonModel = value
        this.UpdateSelectStates()
        this._onSelectedButtonModelChanged?.(value)
    }
    private _SelectedButtonModel?: NavButtonModel
    //#endregion 【Properties】

    //#region 【Events】
    /** 点击“导航栏开关”按钮 */
    btnNavSwitch_Click() {
        this.IsOpen.value = !this.IsOpen.value;
    }
    //#endregion 【Events】

    //#region 【Ctor】
    constructor() {
        this.FolderModel = new NavFolderModel(this);
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    //#region [Private]
    /** 更新“选中状态” */
    private UpdateSelectStates() {
        NavFolderModel.RecursivelyOperateSubItems(
            this.FolderModel,
            undefined,
            buttonModel => {
                buttonModel.IsSelected.value = buttonModel === this.SelectedButtonModel
            });
    }
    //#endregion [Private]

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

export {
    NavBarModel,
    type TryNavButtonHandler
}