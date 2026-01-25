import { type Component } from 'vue'
import { NavBarModel } from './NavBarModel'
import { type NavButtonHandler, NavButtonModel } from "./NavButtonModel"
import { type NavFolderHandler, NavFolderModel } from './NavFolderModel'

class NavButtonConfig {
    _component?: Component
    Icon?: string
    Title?: string
    IsShow?: boolean
    IsShowCloseButton?: boolean
    Clicked?: NavButtonHandler
    Checked?: NavButtonHandler
}

class NavFolderConfig {
    _component?: Component
    Icon?: string
    Title?: string
    IsShow?: boolean
    IsOpen?: boolean
    SubItemsHeight?: number
    Buttons?: NavButtonConfig[]
    Folders?: NavFolderConfig[]
    Clicked?: NavFolderHandler
    Opened?: NavFolderHandler
    Closed?: NavFolderHandler
}

function SetNavButtonModel(model: NavButtonModel, config: NavButtonConfig) {
    model._component = config._component
    if (config.Icon) model.Icon.value = config.Icon
    if (config.Title) model.Title.value = config.Title
    if (config.IsShow) model.IsShow.value = config.IsShow
    if (config.IsShowCloseButton) model.IsShowCloseButton.value = config.IsShowCloseButton
    model.Clicked = config.Clicked
    model.Checked = config.Checked
}

function SetNavFolderModel(model: NavFolderModel, config: NavFolderConfig) {
    if (config.Icon) model.Icon.value = config.Icon
    if (config.Title) model.Title.value = config.Title
    if (config.IsShow) model.IsShow.value = config.IsShow
    if (config.IsOpen) model.IsOpen.value = config.IsOpen
    if (config.SubItemsHeight) model.SubItemsHeight.value = config.SubItemsHeight
    model.Clicked = config.Clicked
    model.Opened = config.Opened
    model.Closed = config.Closed
}

function CreateNavFolderModel(barModel: NavBarModel, folder: NavFolderConfig) {
    let folderModel = new NavFolderModel(barModel)
    SetNavFolderModel(folderModel, folder)

    // 子按钮:
    if (folder.Buttons) {
        folder.Buttons.forEach(b => {
            let buttonModel = new NavButtonModel(barModel, folderModel)
            SetNavButtonModel(buttonModel, b)
            folderModel.ButtonModels.push(buttonModel)
        })
    }

    // 子文件夹:
    if (folder.Folders) {
        folder.Folders.forEach(f => {
            folderModel.FolderModels.push(CreateNavFolderModel(barModel, f))
        })
    }

    return folderModel
}

export {
    NavButtonConfig,
    NavFolderConfig,
    SetNavButtonModel,
    SetNavFolderModel,
    CreateNavFolderModel
}