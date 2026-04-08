import { SelectModel } from "@/0_tigersan_ui/tigerui"
import { IdNameModel, IdNameModelHelper } from "../base/IdNameModel"

export type ScenarioEvent = (model: ScenarioModel) => void

/** "场地类型"模型 */
export class ScenarioModel extends IdNameModel {
}

class ScenarioMgtHelper extends IdNameModelHelper<ScenarioModel> {
    constructor() {
        super('Scenario')
    }

    /** 获取“筛选框模型” */
    GetSelectModel(): SelectModel<IdNameModel> {
        return super.GetSelectModel('请选择场景', 'Please select a scenario')
    }
}

export const scenarioMgtHelper = new ScenarioMgtHelper()