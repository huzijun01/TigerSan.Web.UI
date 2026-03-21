import { IdModel, IdModelHelper } from "./base/IdModel"

export type PersonEvent = (model: PersonModel) => void

/** "组织机构"模型 */
export class PersonModel extends IdModel {
    role: bigint = 0n
    username = ''
    nickname = ''
    password = ''
    photo = ''
}

class PersonMgtHelper extends IdModelHelper<PersonModel> {
    constructor() {
        super('Person')
    }
}

export const personMgtHelper = new PersonMgtHelper()