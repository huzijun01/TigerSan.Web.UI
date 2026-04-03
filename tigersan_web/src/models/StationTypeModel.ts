import { SelectModel } from "@/0_tigersan_ui/tigerui"
import { IdNameModel, IdNameModelHelper } from "./base/IdNameModel"

export type StationTypeEvent = (model: StationTypeModel) => void

/** "场地类型"模型 */
export class StationTypeModel extends IdNameModel {
}

class StationTypeMgtHelper extends IdNameModelHelper<StationTypeModel> {
    constructor() {
        super('StationType')
    }

    /** 获取“筛选框模型” */
    GetSelectModel(): SelectModel<IdNameModel> {
        return super.GetSelectModel('请选择类型', 'Please select a type')
    }
}

export const stationTypeMgtHelper = new StationTypeMgtHelper()