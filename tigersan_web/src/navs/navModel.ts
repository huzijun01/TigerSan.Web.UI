import { NavBarModel } from '@/0_tigersan_ui/tigerui'
import { navHomeMgt } from "@/navs/navHomeMgt"
import { navBasicSettings } from "@/navs/navBasicSettings"

let navModel = new NavBarModel()

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

export {
    navModel,
    NavData,
    navData
}