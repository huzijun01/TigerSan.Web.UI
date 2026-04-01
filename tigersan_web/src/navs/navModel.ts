import { authorityHelper, NavBarModel } from '@/0_tigersan_ui/tigerui'
import { navHome } from "@/navs/navHome"
import { navBasicSettings } from "@/navs/navBasicSettings"

export let navModel = new NavBarModel()
let navModelHome = new NavBarModel(navHome, '主页')
let navModelBasicSettings = new NavBarModel(navBasicSettings, '基础设置')

export class NavData {
    InitHome = () => {
        navModel.IsOpen.value = true
        navModel.Init(navHome)
    }
    InitBasicSettings = () => {
        navModel.IsOpen.value = true
        navModel.Init(navBasicSettings)
    }
}

export const navData = new NavData()

export function InitTree() {
    authorityHelper.ClearTreeConfigs()
    authorityHelper.AddNav2TreeConfigs(navModelBasicSettings)
    authorityHelper.AddNav2TreeConfigs(navModelHome)
}
