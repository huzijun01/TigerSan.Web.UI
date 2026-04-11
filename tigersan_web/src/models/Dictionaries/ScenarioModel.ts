import { IdNameModel, IdNameModelHelper, SelectModel } from "@/0_tigersan_ui/tigerui"

/** "场地类型"模型 */
export class ScenarioModel extends IdNameModel {
}

class ScenarioMgtHelper extends IdNameModelHelper<ScenarioModel> {
    constructor() {
        super('Scenario')
    }

    /** 获取“筛选框模型” */
    GetIdNameSelectModel(): SelectModel<IdNameModel> {
        return super.GetIdNameSelectModel('请选择场景', 'Please select a scenario')
    }
}

export const scenarioMgtHelper = new ScenarioMgtHelper()