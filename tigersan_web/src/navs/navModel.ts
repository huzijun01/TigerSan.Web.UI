import { NavBarModel } from '@/0_tigersan_ui/tigerui'
import { navHomeMgt } from "@/navs/navHomeMgt"
import { navBasicSettings } from "@/navs/navBasicSettings"
import { authorityHelper } from '@/models/AuthorityModel'

let navModel = new NavBarModel()
let navModelHome = new NavBarModel(navHomeMgt)
let navModelBasicSettings = new NavBarModel(navBasicSettings)

class NavData {
    GoHome = () => {
        navModel.IsOpen.value = true
        navModel.Init(navHomeMgt)
    }
    GoBasicSettings = () => {
        navModel.IsOpen.value = true
        navModel.Init(navBasicSettings)
    }
}

const navData = new NavData()

export function InitTree() {
    authorityHelper._tree._configs.splice(0)
    authorityHelper.AddNav2Tree(navModelBasicSettings, '基础设置')
    authorityHelper.AddNav2Tree(navModelHome, '主页')
}

export {
    navModel,
    NavData,
    navData
}