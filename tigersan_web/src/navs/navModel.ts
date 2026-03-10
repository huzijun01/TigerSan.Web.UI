import { NavBarModel } from '@/0_tigersan_ui/tigerui'
import { navHomeMgt } from "@/navs/navHomeMgt"
import { navBaseSetting } from "@/navs/navBaseSetting"

let navModel = new NavBarModel()

class NavData {
    GoHome = () => {
        navModel.IsOpen.value = true
        navModel.Init(navHomeMgt)
    }
    GoBaseSetting = () => {
        navModel.IsOpen.value = true
        navModel.Init(navBaseSetting)
    }
}

const navData = new NavData()

export {
    navModel,
    NavData,
    navData
}