import { SelectModel } from "@/0_tigersan_ui/tigerui"
import { IdNameModel } from "../base/SelectModel"
import { IdNameModelHelper } from "../base/IdNameModel"

/** "场地类型"模型 */
export class TagTypeModel extends IdNameModel {
}

class TagTypeMgtHelper extends IdNameModelHelper<TagTypeModel> {
    constructor() {
        super('TagType')
    }

    /** 获取“筛选框模型” */
    GetIdNameSelectModel(): SelectModel<IdNameModel> {
        return super.GetIdNameSelectModel('请选择类型', 'Please select a type')
    }
}

export const tagTypeMgtHelper = new TagTypeMgtHelper()