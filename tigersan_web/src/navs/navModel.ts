import { authorityHelper, NavBarModel } from '@/0_tigersan_ui/tigerui'
import { navHomeMgt } from "@/navs/navHomeMgt"
import { navBasicSettings } from "@/navs/navBasicSettings"

export let navModel = new NavBarModel()
let navModelHome = new NavBarModel(navHomeMgt, '主页')
let navModelBasicSettings = new NavBarModel(navBasicSettings, '基础设置')

export class NavData {
    GoHome = () => {
        navModel.IsOpen.value = true
        navModel.Init(navHomeMgt)
    }
    GoBasicSettings = () => {
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
