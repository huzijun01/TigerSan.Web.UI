import { type Component } from 'vue'
import { NavBarModel } from './NavBarModel'
import { type NavButtonHandler, NavButtonModel } from "./NavButtonModel"
import { type NavFolderHandler, NavFolderModel } from './NavFolderModel'

class NavFolderConfig {
    /** 图标 */
    Icon?: string
    /** 标题 */
    Title?: string
    /** 是否显示 */
    IsShow?: boolean
    /** 是否打开 */
    IsOpen?: boolean
    /** 子项高度 */
    SubItemsHeight?: number
    /** 按钮集合 */
    Buttons?: NavButtonConfig[]
    /** 目录集合 */
    Folders?: NavFolderConfig[]
    /** 点击后 */
    Clicked?: NavFolderHandler
    /** 打开后 */
    Opened?: NavFolderHandler
    /** 关闭后 */
    Closed?: NavFolderHandler
}

class NavButtonConfig {
    /** 组件 */
    _component?: Component
    /** 图标 */
    Icon?: string
    /** 标题 */
    Title?: string
    /** 是否显示 */
    IsShow?: boolean
    /** 是否打开 */
    IsOpen?: boolean
    /** 是否被选中 */
    IsSelected?: boolean
    /** 是否显示关闭按钮 */
    IsShowCloseButton?: boolean
    /** 点击后 */
    Clicked?: NavButtonHandler
    /** 选中后 */
    Checked?: NavButtonHandler
}

function SetNavFolderModel(model: NavFolderModel, config: NavFolderConfig) {
    if (config.Icon != undefined) model.Icon.value = config.Icon
    if (config.Title != undefined) model.Title.value = config.Title
    if (config.IsShow != undefined) model.IsShow.value = config.IsShow
    if (config.IsOpen != undefined) model.IsOpen.value = config.IsOpen
    if (config.SubItemsHeight != undefined) model.SubItemsHeight.value = config.SubItemsHeight
    model.Clicked = config.Clicked
    model.Opened = config.Opened
    model.Closed = config.Closed
}

function SetNavButtonModel(model: NavButtonModel, config: NavButtonConfig) {
    model._component = config._component
    if (config.Icon != undefined) model.Icon.value = config.Icon
    if (config.Title != undefined) model.Title.value = config.Title
    if (config.IsShow != undefined) model.IsShow.value = config.IsShow
    if (config.IsShowCloseButton != undefined) model.IsShowCloseButton.value = config.IsShowCloseButton
    model.Clicked = config.Clicked
    model.Checked = config.Checked
}

function CreateNavFolderModel(
    barModel: NavBarModel,
    folder: NavFolderConfig,
    folderModel?: NavFolderModel) {
    let newFolderModel = new NavFolderModel(barModel, folderModel)
    SetNavFolderModel(newFolderModel, folder)

    // 子文件夹:
    if (folder.Folders) {
        folder.Folders.forEach(f => {
            newFolderModel.FolderModels.push(CreateNavFolderModel(barModel, f, newFolderModel))
        })
    }

    // 子按钮:
    if (folder.Buttons) {
        folder.Buttons.forEach(b => {
            let buttonModel = new NavButtonModel(barModel, newFolderModel)
            SetNavButtonModel(buttonModel, b)
            newFolderModel.ButtonModels.push(buttonModel)

            // 打开:
            if (b.IsOpen == true || b.IsSelected == true) {
                barModel.OpenedButtonModels.push(buttonModel)
            }

            // 选中:
            if (b.IsSelected == true) {
                barModel.SelectedButtonModel = buttonModel
            }
        })
    }

    // 默认选中:
    if (barModel.OpenedButtonModels.length > 0 && !barModel.SelectedButtonModel) {
        barModel.SelectedButtonModel = barModel.OpenedButtonModels[0]
    }

    return newFolderModel
}

export {
    NavFolderConfig,
    NavButtonConfig,
    SetNavFolderModel,
    SetNavButtonModel,
    CreateNavFolderModel
}