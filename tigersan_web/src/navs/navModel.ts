import { NavBarModel } from '@/0_tigersan_ui/tigerui'
import { navHomeMgt } from "@/navs/navHomeMgt"
import { navCompanyMgt } from "@/navs/navCompanyMgt"

let navModel = new NavBarModel()

class NavData {
    GoHome = () => {
        navModel.IsOpen.value = true
        navModel.Init(navHomeMgt)
    }
    GoCompanyMgt = () => {
        navModel.IsOpen.value = true
        navModel.Init(navCompanyMgt)
    }
}

const navData = new NavData()

export {
    navModel,
    NavData,
    navData
}