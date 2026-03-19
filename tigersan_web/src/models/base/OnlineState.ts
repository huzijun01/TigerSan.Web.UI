import { Texts } from "@/0_tigersan_ui/src/texts"
import { ObjectHelper } from "@/0_tigersan_ui/tigerui"

enum OnlineState {
    Online = 1,
    Offline = 0,
}

function IsOnline(obj: object, propName: string = 'OnlineState'): boolean {
    return ObjectHelper.DefaultNumberGetter(obj, propName) === OnlineState.Online
}

function GetOnlineString(obj: object, propName: string = 'OnlineState'): string {
    return ObjectHelper.DefaultNumberGetter(obj, propName) === OnlineState.Online ? Texts.Online.value : Texts.Offline.value
}

export {
    OnlineState,
    IsOnline,
    GetOnlineString
}