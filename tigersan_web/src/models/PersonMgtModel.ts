import { IdModel, IdModelHelper } from "./base/IdModel"

export type PersonEvent = (model: PersonMgtModel) => void

/** "组织机构"模型 */
export class PersonMgtModel extends IdModel {
    role = 0
    username = ''
    nickname = ''
    password = ''
    photo = ''
}

class PersonMgtHelper extends IdModelHelper<PersonMgtModel> {
    constructor() {
        super('PersonMgt')
    }
}

export const personMgtHelper = new PersonMgtHelper()