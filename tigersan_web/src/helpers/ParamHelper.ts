export class KeyValue {
    key: string = ''
    value?: string | number | bigint = ''
}

export class ParamHelper {
    static IsNotEmpty(value?: string | number | bigint) {
        return value != undefined && value != null && value.toString().trim() != ''
    }

    static GetParamString(params: KeyValue[]): string {
        if (params.length === 0) return '';

        const queryParts: string[] = []
        params.forEach(param => {
            if (this.IsNotEmpty(param.key) && this.IsNotEmpty(param.value)) {
                if (param.value === undefined) {
                    console.warn('The value is undefined!')
                    return
                }
                const encodedKey = encodeURIComponent(param.key)
                const encodedValue = encodeURIComponent(param.value.toString())
                queryParts.push(`${encodedKey}=${encodedValue}`)
            }
        })

        return `?${queryParts.join('&')}`;
    }
}