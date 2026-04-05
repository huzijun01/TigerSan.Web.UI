export class FilterModel {
    parent?: ParentFilterModel
    filters?: PropFilterModel[]
}

export class PropFilterModel {
    propName = ''
    value?: unknown
    values?: unknown[] = []

    constructor(
        propName: string = '',
        value?: unknown,
        values?: unknown[]) {
        this.propName = propName
        this.value = value
        this.values = values
    }
}

export class ParentFilterModel {
    ids: bigint[] = []
    parent?: ParentFilterModel
}