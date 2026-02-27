import { ObjectHelper } from "@/0_tigersan_ui/tigerui"

enum OnlineState {
    Online = '在线',
    Offline = '离线',
}

function IsOnline(obj: object, propName: string = 'State') {
    ObjectHelper.DefaultStringGetter(obj, propName) === OnlineState.Online
}

export {
    OnlineState,
    IsOnline,
}