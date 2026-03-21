import { IdModel, IdModelHelper } from "./base/IdModel"

export type RoleEvent = (model: RoleModel) => void

/** "组织机构"模型 */
export class RoleModel extends IdModel {
    company: bigint = 0n
    name: string = ''
}

class RoleMgtHelper extends IdModelHelper<RoleModel> {
    constructor() {
        super('Role')
    }
}

export const roleMgtHelper = new RoleMgtHelper()