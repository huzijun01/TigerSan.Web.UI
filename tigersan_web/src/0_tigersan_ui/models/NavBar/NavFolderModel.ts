import { ref, shallowReactive, type ShallowReactive } from 'vue'
import { Icons } from '../../base';
import type { Action } from '../../base/types';
import { nanoid } from 'nanoid'
import { NavBarModel } from './NavBarModel'
import { NavButtonModel, type NavButtonHandler } from './NavButtonModel'

type NavFolderHandler = (folderModel: NavFolderModel) => void

class SubItemCount {
    FolderCount: number = 0
    ButtonCount: number = 0
}

class NavFolderModel {
    //#region 【Fields】
    _id = nanoid()

    _oldHeight: number = 0
    _oldIsOpened: boolean = true

    /** 更新“文件夹”高度
     * （NavFolder内部会自动添加回调） */
    public _updateFolderHeight?: Action;
    //#endregion 【Fields】

    //#region 【Properties】
    Icon = ref(Icons.Folder_Linear)
    Title = ref("null")
    IsShow = ref(true)
    IsOpen = ref(true)
    SubItemsHeight = ref(50)
    NavBarModel: NavBarModel
    ButtonModels: ShallowReactive<NavButtonModel[]> = shallowReactive([])
    FolderModels: ShallowReactive<NavFolderModel[]> = shallowReactive([])
    //#endregion 【Properties】

    //#region 【Events】
    Clicked?: NavFolderHandler
    Opened?: NavFolderHandler
    Closed?: NavFolderHandler
    //#endregion 【Events】

    //#region 【Ctor】
    constructor(navBarModel: NavBarModel) {
        this.NavBarModel = navBarModel
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 递归操作“子项”集合 */
    static RecursivelyOperateSubItems(
        folderModel: NavFolderModel,
        fnFolder: NavFolderHandler | undefined,
        fnButton: NavButtonHandler | undefined = undefined) {
        // 目录：
        for (const subFolderModel of folderModel.FolderModels) {
            fnFolder?.(subFolderModel)
            NavFolderModel.RecursivelyOperateSubItems(subFolderModel, fnFolder, fnButton)
        }

        // 按钮：
        if (!fnButton) return

        for (const buttonModel of folderModel.ButtonModels) {
            fnButton?.(buttonModel)
        }
    }

    /** 添加“按钮” */
    AddButton(buttonModel: NavButtonModel) {
        this.ButtonModels.push(buttonModel)
    }

    /** 添加“文件夹” */
    AddFolder(folderModel: NavFolderModel) {
        this.FolderModels.push(folderModel)
    }

    /** 更新“高度” */
    UpdateHeight() {
        var newHeight = this.GetSubItemsHeight()
        if (this._oldHeight === newHeight
            && this._oldIsOpened === this.IsOpen.value) return

        this.SubItemsHeight.value = this.IsOpen.value ? newHeight : 0
        this.UpdateOldState()
    }

    /** 更新“旧状态” */
    UpdateOldState() {
        this._oldIsOpened = this.IsOpen.value
        this._oldHeight = this.GetSubItemsHeight()
    }

    /** 获取“子项”的“个数” */
    GetOpenedSubItemCount(isExcludeNotDisplayButton: boolean = true): SubItemCount {
        var count = new SubItemCount()

        NavFolderModel.RecursivelyOperateSubItems(
            this,
            folderModel => { ++count.FolderCount },
            buttonModel => {
                if (
                    isExcludeNotDisplayButton
                    && buttonModel.NavFolderModel != this
                    && !buttonModel.NavFolderModel.IsOpen.value) {
                    return
                }
                ++count.ButtonCount
            })

        return count;
    }

    /** 获取“子项”的“总高度 */
    GetSubItemsHeight(): number {
        var count = this.GetOpenedSubItemCount();

        if (!this.NavBarModel._getFolderHeight) {
            return 0
        }

        if (!this.NavBarModel._getButtonHeight) {
            return 0
        }

        return count.FolderCount * this.NavBarModel._getFolderHeight()
            + count.ButtonCount * this.NavBarModel._getButtonHeight()
    }
    //#endregion 【Functions】
}

export {
    type NavFolderHandler,
    SubItemCount,
    NavFolderModel
}