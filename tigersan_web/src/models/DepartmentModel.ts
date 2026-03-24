import { SelectModel } from "@/0_tigersan_ui/tigerui"
import { IdNameModel, IdNameModelHelper } from "./base/IdNameModel"

export type DepartmentEvent = (model: DepartmentModel) => void

/** "组织机构"模型 */
export class DepartmentModel extends IdNameModel {
    company: bigint = 0n
}

class DepartmentMgtHelper extends IdNameModelHelper<DepartmentModel> {
    constructor() {
        super('Department')
    }

    /** 获取“筛选框模型” */
    GetSelectModel(): SelectModel<IdNameModel> {
        return super.GetSelectModel('请选择部门', 'Please select a department')
    }
}

export const departmentMgtHelper = new DepartmentMgtHelper()