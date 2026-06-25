/** ID名称对 */
export class IdNameModel {
    id: bigint = 0n
    name = ''
    company?: bigint = 0n
    companyName?: string

    constructor(id?: bigint, name?: string) {
        if (id) this.id = id
        if (name) this.name = name
    }
}

/** ID值对 */
export class IdValueModel {
    id: bigint = 0n
    value = ''

    constructor(id?: bigint, value?: string) {
        if (id) this.id = id
        if (value) this.value = value
    }
}