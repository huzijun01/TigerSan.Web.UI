import { NavBarModel } from '@/0_tigersan_ui/tigerui'
import { homeMgtNavConfig } from "@/routes/Home/homeMgtNavConfig"
import { companyMgtNavConfig } from "@/routes/Home/companyMgtNavConfig"

let navModel = new NavBarModel()

class NavData {
    GoHome = () => {
        navModel.IsOpen.value = true
        navModel.Init(homeMgtNavConfig)
    }
    GoCompanyMgt = () => {
        navModel.IsOpen.value = true
        navModel.Init(companyMgtNavConfig)
    }
}

const navData = new NavData()

export {
    navModel,
    NavData,
    navData
}