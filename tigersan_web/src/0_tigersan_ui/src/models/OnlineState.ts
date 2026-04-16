import { Texts } from "../texts"
import { SelectModel } from "./Inputs/SelectModel"
import { ObjectHelper } from "../helpers/ObjectHelper"

export enum OnlineStates {
    Offline = 0,
    Online = 1,
}

export class OnlineState {
    static readonly ToString = (value: OnlineStates) => {
        return value === OnlineStates.Online ? Texts.Online.value : Texts.Offline.value
    }

    static readonly GetString = (obj: object, propName: string = 'OnlineState'): string => {
        return ObjectHelper.DefaultNumberGetter(obj, propName) === OnlineStates.Online ? Texts.Online.value : Texts.Offline.value
    }

    static readonly IsOnline = (obj: object, propName: string = 'OnlineState'): boolean => {
        return ObjectHelper.DefaultNumberGetter(obj, propName) === OnlineStates.Online
    }

    static readonly GetSelectModel = () => {
        const select = new SelectModel<OnlineStates>()
        select.Width.value = 120
        select.Value.value = undefined
        select.IsAllowSearch.value = true
        select.PlaceholderCN.value = '在线状态'
        select.PlaceholderEN.value = 'OnlineState'
        select.Items.push(...[OnlineStates.Online, OnlineStates.Offline])
        select._converter = OnlineState.ToString
        return select
    }
}

export class IsEnable {
    static readonly ToString = (value: boolean) => {
        return value ? Texts.Enable.value : Texts.Disable.value
    }

    static readonly GetString = (obj: object, propName: string = 'IsEnable'): string => {
        return ObjectHelper.DefaultTGetter(obj, propName, false) ? Texts.Enable.value : Texts.Disable.value
    }

    static readonly GetSelectModel = () => {
        const select = new SelectModel<boolean>()
        select.Width.value = 120
        select.Value.value = undefined
        select.IsAllowSearch.value = true
        select.PlaceholderCN.value = '激活状态'
        select.PlaceholderEN.value = 'IsEnable'
        select.Items.push(...[true, false])
        select._converter = IsEnable.ToString
        return select
    }
}
