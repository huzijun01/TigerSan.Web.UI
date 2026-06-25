import { Texts } from "../texts"
import { Colors } from "../base"
import { TableItemModel } from "../models"
import { SelectModel } from "./Inputs/SelectModel"
import { ObjectHelper } from "../helpers/ObjectHelper"

export enum OnlineStates {
    Offline = 0,
    Online = 1,
}

export class OnlineState {
    static ToString(value?: OnlineStates) {
        return value === OnlineStates.Online ? Texts.Online.value : Texts.Offline.value
    }

    static GetString(obj: object, propName: string = 'OnlineState'): string {
        return ObjectHelper.DefaultNumberGetter(obj, propName) === OnlineStates.Online ? Texts.Online.value : Texts.Offline.value
    }

    static IsOnline(obj: object, propName: string = 'OnlineState'): boolean {
        return ObjectHelper.DefaultNumberGetter(obj, propName) === OnlineStates.Online
    }

    static GetSelectModel() {
        const select = new SelectModel<OnlineStates>()
        select.Width.value = 120
        select.Value.value = undefined
        select.PlaceholderCN.value = '在线状态'
        select.PlaceholderEN.value = 'OnlineState'
        select.Items.push(...[OnlineStates.Online, OnlineStates.Offline])
        select._converter = OnlineState.ToString
        return select
    }

    /** 初始化“项目模型” */
    static InitItemModel(itemModel: TableItemModel<any>, propName: string = 'onlineState') {
        if (itemModel._headerModel._propName === propName) {
            if (itemModel.GetSource() === OnlineStates.Online) {
                itemModel.Color.value = Colors.Success
                itemModel.Background.value = Colors.Success10
            } else {
                itemModel.Color.value = Colors.Danger
                itemModel.Background.value = Colors.Danger10
            }
        }
    }
}

export class IsEnable {
    static ToString(value: boolean) {
        return value ? Texts.Enable.value : Texts.Disable.value
    }

    static GetString(obj: object, propName: string = 'isEnable'): string {
        return ObjectHelper.DefaultTGetter(obj, propName, false) ? Texts.Enable.value : Texts.Disable.value
    }

    static GetSelectModel() {
        const select = new SelectModel<boolean>()
        select.Width.value = 120
        select.Value.value = undefined
        select.PlaceholderCN.value = '激活状态'
        select.PlaceholderEN.value = 'IsEnable'
        select.Items.push(...[true, false])
        select._converter = IsEnable.ToString
        return select
    }

    /** 初始化“项目模型” */
    static InitItemModel(itemModel: TableItemModel<any>, propName: string = 'isEnable') {
        if (itemModel._headerModel._propName === propName) {
            if (itemModel.GetSource()) {
                itemModel.Color.value = Colors.Success
                itemModel.Background.value = Colors.Success10
            } else {
                itemModel.Color.value = Colors.Danger
                itemModel.Background.value = Colors.Danger10
            }
        }
    }
}

export class IsFall {
    static ToString(value?: boolean) {
        if (value === undefined || value === null) return ''
        return value ? Texts.Fall.value : Texts.Normal.value
    }

    static GetString(obj: object, propName: string = 'isFall'): string {
        return IsFall.ToString(ObjectHelper.DefaultTGetter(obj, propName, undefined))
    }

    static GetSelectModel() {
        const select = new SelectModel<boolean>()
        select.Width.value = 120
        select.Value.value = undefined
        select.PlaceholderCN.value = '是否脱落'
        select.PlaceholderEN.value = 'IsFall'
        select.Items.push(...[true, false])
        select._converter = IsFall.ToString
        return select
    }

    /** 初始化“项目模型” */
    static InitItemModel(itemModel: TableItemModel<any>, propName: string = 'isFall') {
        if (itemModel._headerModel._propName === propName) {
            const source = itemModel.GetSource()
            if (source === undefined || source === null) {
                return
            }
            else if (source) {
                itemModel.Color.value = Colors.Danger
                itemModel.Background.value = Colors.Danger10
            } else {
                itemModel.Color.value = Colors.Success
                itemModel.Background.value = Colors.Success10
            }
        }
    }
}

export class Battery {
    /** 初始化“项目模型” */
    static InitItemModel(itemModel: TableItemModel<any>, propName: string = 'battery') {
        if (itemModel._headerModel._propName === propName) {
            const battery = itemModel.GetSource() as number
            if (battery >= 50) {
                itemModel.Color.value = Colors.Success
            } else if (battery >= 25) {
                itemModel.Color.value = Colors.Warning
            } else {
                itemModel.Color.value = Colors.Danger
            }
        }
    }
}

export class Signal {
    /** 初始化“项目模型” */
    static InitItemModel(itemModel: TableItemModel<any>, propName: string = 'signal') {
        if (itemModel._headerModel._propName === propName) {
            const signal = itemModel.GetSource() as number
            if (signal < 30) {
                itemModel.Color.value = Colors.Success
            } else if (signal < 90) {
                itemModel.Color.value = Colors.Warning
            } else {
                itemModel.Color.value = Colors.Danger
            }
        }
    }
}