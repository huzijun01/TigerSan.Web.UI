export class BigintHelper {
    /** 是否“相等且不为空” */
    static IsEqualAndNotUndefined(value1?: bigint | number, value2?: bigint | number): boolean {
        if (value1 === undefined || value2 === undefined || value1 === null || value2 === null) return false
        return value1.toString() === value2.toString()
    }
}