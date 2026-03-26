import { FormResult, VerifyResult } from "../models/Form/FormModel"

export class Verify {
    /** 获取“OK” */
    static GetOK(msg: string) {
        const res = new VerifyResult()
        res.VerifyText = msg
        res.VerifyState = FormResult.OK
        return res;
    }

    /** 获取“警告” */
    static GetWarning(msg: string) {
        const res = new VerifyResult()
        res.VerifyText = msg
        res.VerifyState = FormResult.Warning
        return res;
    }

    /** 获取“错误” */
    static GetError(msg: string) {
        const res = new VerifyResult()
        res.VerifyText = msg
        res.VerifyState = FormResult.Error
        return res;
    }

    /** 是否“为合法用户名” */
    static IsValidUsername(str: string, min: number = 3, max: number = 15): VerifyResult {
        const res = new VerifyResult()

        // 长度校验:
        if (str === undefined || str === null) {
            res.VerifyText = '输入不能为空'
            res.VerifyState = FormResult.Error
            return res;
        }

        // 动态构建正则:
        const pattern = `^[a-zA-Z_][a-zA-Z0-9_-]{${min - 1},${max - 1}}$`
        const regex = new RegExp(pattern);

        // 字符集、首字符、特殊符号校验:
        if (!regex.test(str)) {
            // 细化错误提示
            if (str.length < min) {
                res.VerifyText = `长度不能少于${min}字符`
            } else if (str.length > max) {
                res.VerifyText = `长度不能超过${max}字符`
            } else {
                res.VerifyText = '包含非法字符或格式错误'
            }
            res.VerifyState = FormResult.Error
            return res
        }

        // 通过所有校验:
        return res
    }

    /** 是否“定义且非空” */
    static IsNotUndefined(obj?: object | number | Array<any>): VerifyResult {
        var res = new VerifyResult()

        if (obj === undefined || obj === null) {
            res.VerifyText = '不能为空'
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否“定义且非空” */
    static IsNotUndefinedOrEmpty(str?: string): VerifyResult {
        var res = new VerifyResult()

        if (!str || str.trim() === '') {
            res.VerifyText = '不能为空'
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否“大于” */
    static IsGreaterThan(num: number, min: number = 0, error?: string): VerifyResult {
        var res = new VerifyResult()

        if (isNaN(num)) {
            res.VerifyText = '必须为数字'
            res.VerifyState = FormResult.Error
        }
        else if (num <= min) {
            res.VerifyText = error ?? `不可小于${min}`
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否“大于”（bigint） */
    static IsBigintGreaterThan(num: bigint, min: bigint = 0n, error?: string): VerifyResult {
        const res = new VerifyResult();

        if (num <= min) {
            res.VerifyText = error ?? `不可小于${min.toString()}`;
            res.VerifyState = FormResult.Error;
        }

        return res;
    }

    /** 是否“小于” */
    static IsLessThan(num: number, max: number, error?: string): VerifyResult {
        var res = new VerifyResult()

        if (isNaN(num)) {
            res.VerifyText = '必须为数字'
            res.VerifyState = FormResult.Error
        }
        else if (num >= max) {
            res.VerifyText = error ?? `不可大于${max}`
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否“在范围内” */
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