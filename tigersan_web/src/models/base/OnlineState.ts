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

export const OnlineState2String = (value: OnlineState) => {
    return value === OnlineState.Online ? '在线' : '离线'
}
