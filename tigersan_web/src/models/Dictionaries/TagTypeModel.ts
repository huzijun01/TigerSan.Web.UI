import { SelectModel } from "@/0_tigersan_ui/tigerui"
import { IdNameModel, IdNameModelHelper } from "../base/IdNameModel"

export type TagTypeEvent = (model: TagTypeModel) => void

/** "场地类型"模型 */
export class TagTypeModel extends IdNameModel {
}

class TagTypeMgtHelper extends IdNameModelHelper<TagTypeModel> {
    constructor() {
        super('TagType')
    }

    /** 获取“筛选框模型” */
    GetSelectModel(): SelectModel<IdNameModel> {
        return super.GetSelectModel('请选择类型', 'Please select a type')
    }
}

export const tagTypeMgtHelper = new TagTypeMgtHelper()