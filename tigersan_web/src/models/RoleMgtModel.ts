import { IdModel, IdModelHelper } from "./base/IdModel"

export type RoleEvent = (model: RoleMgtModel) => void

/** "组织机构"模型 */
export class RoleMgtModel extends IdModel {
    company: number = 0
    name: string = ''
}

class RoleMgtHelper extends IdModelHelper<RoleMgtModel> {
    constructor() {
        super('RoleMgt')
    }
}

export const roleMgtHelper = new RoleMgtHelper()