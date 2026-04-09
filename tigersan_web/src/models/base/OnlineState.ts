import { Texts } from "@/0_tigersan_ui/src/texts"
import { ObjectHelper } from "@/0_tigersan_ui/tigerui"

export enum OnlineState {
    Online = 1,
    Offline = 0,
}

export const IsOnline = (obj: object, propName: string = 'OnlineState'): boolean => {
    return ObjectHelper.DefaultNumberGetter(obj, propName) === OnlineState.Online
}

export const GetOnlineString = (obj: object, propName: string = 'OnlineState'): string => {
    return ObjectHelper.DefaultNumberGetter(obj, propName) === OnlineState.Online ? Texts.Online.value : Texts.Offline.value
}

export const GetIsEnableString = (obj: object, propName: string = 'IsEnable'): string => {
    return ObjectHelper.DefaultTGetter(obj, propName, false) ? Texts.Enable.value : Texts.Disable.value
}

export const OnlineState2String = (value: OnlineState) => {
    return value === OnlineState.Online ? Texts.Online.value : Texts.Offline.value
}

export const IsEnable2String = (value: boolean) => {
    return value ? Texts.Enable.value : Texts.Disable.value
}

