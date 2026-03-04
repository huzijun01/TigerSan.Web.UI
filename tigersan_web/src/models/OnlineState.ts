import { ObjectHelper } from "@/0_tigersan_ui/tigerui"

enum OnlineState {
    Online = 1,
    Offline = 0,
}

function IsOnline(obj: object, propName: string = 'OnlineState'): boolean {
    return ObjectHelper.DefaultNumberGetter(obj, propName) === OnlineState.Online
}

function GetOnlineString(obj: object, propName: string = 'OnlineState'): string {
    return ObjectHelper.DefaultNumberGetter(obj, propName) === OnlineState.Online ? '在线' : '离线'
}

export {
    OnlineState,
    IsOnline,
    GetOnlineString
}