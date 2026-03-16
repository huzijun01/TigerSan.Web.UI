import { FormResult, VerifyResult } from "../models/Form/FormModel"

export class Verify {
    /** 是否非空 */
    static IsNotEmpty(str: string): VerifyResult {
        var res = new VerifyResult()

        if (str && str.trim() === '') {
            res.VerifyText = '不能为空'
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否定义且非空 */
    static IsNotUndefined(obj?: object): VerifyResult {
        var res = new VerifyResult()

        if (obj === undefined || obj === null) {
            res.VerifyText = '不能为空'
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否定义且非空 */
    static IsNotUndefinedOrEmpty(str?: string): VerifyResult {
        var res = new VerifyResult()

        if (!str || str.trim() === '') {
            res.VerifyText = '不能为空'
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否在范围内 */
    static IsWithinRange(num: number, min: number, max: number): VerifyResult {
        var res = new VerifyResult()

        if (isNaN(num)) {
            res.VerifyText = '必须为数字'
            res.VerifyState = FormResult.Error
        }
        else if (num < min) {
            res.VerifyText = `不可小于${min}`
            res.VerifyState = FormResult.Error
        }
        else if (num > max) {
            res.VerifyText = `不可大于${max}`
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否“数组不为空” */
    static IsArrayNotEmpty(arr: Array<unknown>): VerifyResult {
        var res = new VerifyResult()

        if (arr.length < 1) {
            res.VerifyText = '请选择'
            res.VerifyState = FormResult.Error
        }

        return res
    }
}