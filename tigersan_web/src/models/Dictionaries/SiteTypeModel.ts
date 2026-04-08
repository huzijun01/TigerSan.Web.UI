import { SelectModel } from "@/0_tigersan_ui/tigerui"
import { IdNameModel, IdNameModelHelper } from "../base/IdNameModel"

export type SiteTypeEvent = (model: SiteTypeModel) => void

/** "场地类型"模型 */
export class SiteTypeModel extends IdNameModel {
}

class SiteTypeMgtHelper extends IdNameModelHelper<SiteTypeModel> {
    constructor() {
        super('SiteType')
    }

    /** 获取“筛选框模型” */
    GetSelectModel(): SelectModel<IdNameModel> {
        return super.GetSelectModel('请选择类型', 'Please select a type')
    }
}

export const siteTypeMgtHelper = new SiteTypeMgtHelper()