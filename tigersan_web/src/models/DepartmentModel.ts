import { IdModel, IdModelHelper } from "./base/IdModel"

export type DepartmentEvent = (model: DepartmentModel) => void

/** "组织机构"模型 */
export class DepartmentModel extends IdModel {
    company: bigint = 0n
    name: string = ''
}

class DepartmentMgtHelper extends IdModelHelper<DepartmentModel> {
    constructor() {
        super('Department')
    }
}

export const departmentMgtHelper = new DepartmentMgtHelper()