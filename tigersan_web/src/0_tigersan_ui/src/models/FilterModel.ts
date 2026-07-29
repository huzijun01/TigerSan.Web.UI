/** “过滤器”对象 */
export class FilterDto {
    parent?: ParentFilter
    filters?: PropFilter[]
}

/** “属性”过滤器 */
export class PropFilter {
    propName = ''
    value?: unknown
    values?: unknown[] = []

    constructor(propName: string = '',
        value?: unknown,
        values?: unknown[]) {
        this.propName = propName
        this.value = value
        this.values = values
    }
}

/** “父表”过滤器 */
export class ParentFilter {
    id?: bigint
    ids?: bigint[] = []
    parent?: ParentFilter
}