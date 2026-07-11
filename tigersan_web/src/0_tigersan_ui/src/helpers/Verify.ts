import { FormResult, VerifyResult } from "../models/Form/FormModel"
import { Texts } from "../texts"

export class Verify {
    /** 获取“OK” */
    static GetOK(msg?: string) {
        const res = new VerifyResult()
        res.VerifyText = msg ?? ''
        res.VerifyState = FormResult.OK
        return res
    }

    /** 获取“警告” */
    static GetWarning(msg?: string) {
        const res = new VerifyResult()
        res.VerifyText = msg ?? ''
        res.VerifyState = FormResult.Warning
        return res
    }

    /** 获取“错误” */
    static GetError(msg?: string) {
        const res = new VerifyResult()
        res.VerifyText = msg ?? ''
        res.VerifyState = FormResult.Error
        return res
    }

    /** 是否“定义且非空” */
    static IsNotUndefined<T>(obj?: T): VerifyResult {
        var res = new VerifyResult()

        if (obj === undefined || obj === null) {
            res.VerifyText = Texts.CannotBeEmpty.value
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否“定义且非空” */
    static IsNotUndefinedOrEmpty(str?: string): VerifyResult {
        var res = new VerifyResult()

        if (!str || str.trim() === '') {
            res.VerifyText = Texts.CannotBeEmpty.value
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否“相等” */
    static IsEqual(s1: string, s2: string, strNotEqual?: string): VerifyResult {
        var res = new VerifyResult()

        if (s1.trim() === '' || s2.trim() === '') {
            res.VerifyText = Texts.CannotBeEmpty.value
            res.VerifyState = FormResult.Error
        } else if (s1 != s2) {
            res.VerifyText = strNotEqual ?? '值不相同'
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否“大于” */
    static IsGreaterThan(num: number, min = 0, error?: string): VerifyResult {
        var res = new VerifyResult()

        if (isNaN(num)) {
            res.VerifyText = Texts.PleaseEnterANumber.value
            res.VerifyState = FormResult.Error
        }
        else if (num <= min) {
            res.VerifyText = error ?? `不可小于${min}`
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否“大于”（bigint） */
    static IsBigintGreaterThan(num?: bigint, min: bigint = 0n, error?: string): VerifyResult {
        const res = new VerifyResult()

        if (num === undefined || num === null) {
            res.VerifyText = Texts.CannotBeEmpty.value
            res.VerifyState = FormResult.Error
        }
        else if (num <= min) {
            res.VerifyText = error ?? `不可小于${min.toString()}`
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否“小于” */
    static IsLessThan(num: number, max: number, error?: string): VerifyResult {
        var res = new VerifyResult()

        if (isNaN(num)) {
            res.VerifyText = Texts.PleaseEnterANumber.value
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
            res.VerifyText = Texts.PleaseEnterANumber.value
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
            res.VerifyText = Texts.PleaseSelect.value
            res.VerifyState = FormResult.Error
        }

        return res
    }

    /** 是否“为合法用户名” */
    static IsValidUsername(str: string, min: number = 3, max: number = 15): VerifyResult {
        const res = new VerifyResult()

        // 长度校验:
        if (str === undefined || str === null) {
            res.VerifyText = Texts.CannotBeEmpty.value
            res.VerifyState = FormResult.Error
            return res
        }

        // 动态构建正则:
        const pattern = `^[a-zA-Z_][a-zA-Z0-9_-]{${min - 1},${max - 1}}$`
        const regex = new RegExp(pattern)

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

    /** 是否“为合法昵称” */
    static IsValidNickname(str: string, min: number = 2, max: number = 20): VerifyResult {
        const res = new VerifyResult();

        // 空值校验（包含空字符串检查）
        if (str === undefined || str === null || str === '') {
            res.VerifyText = Texts.CannotBeEmpty.value;
            res.VerifyState = FormResult.Error;
            return res;
        }

        // 动态构建正则：支持中文/字母/数字/下划线/连字符，首字符需为中文或字母
        const pattern = `^[\u4E00-\u9FA5A-Za-z][\u4E00-\u9FA5A-Za-z0-9_-]{${min - 1},${max - 1}}$`;
        const regex = new RegExp(pattern);

        // 字符集、首字符、特殊符号校验
        if (!regex.test(str)) {
            // 细化错误提示（优先长度判断）
            if (str.length < min) {
                res.VerifyText = `长度不能少于${min}字符`;
            } else if (str.length > max) {
                res.VerifyText = `长度不能超过${max}字符`;
            } else {
                // 具体说明非法字符类型
                const invalidChars = [...str].filter(c => !/[\u4E00-\u9FA5A-Za-z0-9_-]/.test(c));
                res.VerifyText = invalidChars.length > 0
                    ? `包含非法字符: ${invalidChars.map(c => `'${c}'`).join(', ')}`
                    : '格式错误';
            }
            res.VerifyState = FormResult.Error;
            return res;
        }

        // 通过所有校验
        res.VerifyState = FormResult.OK;
        return res;
    }

    /** 是否“为合法密码” */
    static IsValidPassword(str: string, min: number = 8, max: number = 20): VerifyResult {
        const res = new VerifyResult()

        // 空值检查
        if (str === undefined || str === null) {
            res.VerifyText = Texts.CannotBeEmpty.value
            res.VerifyState = FormResult.Error
            return res
        }

        // 长度校验
        if (str.length < min) {
            res.VerifyText = `长度不能少于${min}字符`
            res.VerifyState = FormResult.Error
            return res
        }
        if (str.length > max) {
            res.VerifyText = `长度不能超过${max}字符`
            res.VerifyState = FormResult.Error
            return res
        }

        // 字符复杂度校验（使用多个正则分段检查）
        const checks = [
            { regex: /[A-Z]/, msg: '必须包含至少一个大写字母' },
            { regex: /[a-z]/, msg: '必须包含至少一个小写字母' },
            { regex: /\d/, msg: '必须包含至少一个数字' },
            { regex: /[!@#$%^&*()_+\-=[\]{}':"\\|,.<>/?]/, msg: '必须包含至少一个特殊字符' }
        ]

        for (const check of checks) {
            if (!check.regex.test(str)) {
                res.VerifyText = check.msg
                res.VerifyState = FormResult.Error
                return res
            }
        }

        // 禁止空格检查
        if (/\s/.test(str)) {
            res.VerifyText = '不能包含空格'
            res.VerifyState = FormResult.Error
            return res
        }

        // 通过所有校验
        res.VerifyState = FormResult.OK
        return res
    }

    /** 是否“为合法弱密码” */
    static IsValidWeekPassword(str: string, min: number = 8, max: number = 20): VerifyResult {
        const res = new VerifyResult()

        // 空值检查
        if (str === undefined || str === null || str.trim() === '') {
            res.VerifyText = Texts.CannotBeEmpty.value
            res.VerifyState = FormResult.Error
            return res
        }

        // 长度校验
        if (str.length < min) {
            res.VerifyText = `长度不能少于${min}字符`
            res.VerifyState = FormResult.Error
            return res
        }
        if (str.length > max) {
            res.VerifyText = `长度不能超过${max}字符`
            res.VerifyState = FormResult.Error
            return res
        }

        // 复杂度校验（必须同时包含字母和数字）
        const hasLetter = /[a-zA-Z]/.test(str)
        const hasDigit = /\d/.test(str)

        if (!hasLetter) {
            res.VerifyText = '必须包含至少一个字母'
            res.VerifyState = FormResult.Error
            return res
        }

        if (!hasDigit) {
            res.VerifyText = '必须包含至少一个数字'
            res.VerifyState = FormResult.Error
            return res
        }

        // 通过所有校验
        res.VerifyState = FormResult.OK
        return res
    }

    /** 是否“为合法电话号码”（支持国内外格式） */
    static IsValidPhoneNumber(str?: string, isAllowUndefined: boolean = true): VerifyResult {
        const res = new VerifyResult()

        // 允许为空
        if (isAllowUndefined && (str === undefined || str === null || str === '')) {
            return res
        }

        // 空值检查
        if (str === undefined || str === null || str.trim() === '') {
            res.VerifyText = Texts.CannotBeEmpty.value
            res.VerifyState = FormResult.Error
            return res
        }

        // 纯数字校验（禁止任何特殊字符）
        const cleanedStr = str.replace(/\D/g, '')
        if (cleanedStr !== str) {
            res.VerifyText = '只能包含数字'
            res.VerifyState = FormResult.Error
            return res
        }

        // 长度校验（国际E.164标准）
        if (cleanedStr.length < 6 || cleanedStr.length > 15) {
            res.VerifyText = '电话号码长度应在6-15位之间'
            res.VerifyState = FormResult.Error
            return res
        }

        // 更新后的正则表达式（支持无区号座机）
        const patterns = [
            // 国内手机号（11位）
            /^1[3-9]\d{9}$/,

            // 国内座机（支持无区号格式）
            /^\d{7,8}$/,          // 无区号座机（7-8位）
            /^\d{3,4}\d{7,8}$/,   // 带区号座机（3-4位区号+7-8位号码）

            // 国际号码（国家代码+本地号码）
            /^\d{1,3}\d{9,12}$/,  // 1-3位国家代码+9-12位本地号码

            // 特殊号码
            /^(400|800)\d{7}$/   // 400/800开头服务号码
        ]

        // 格式校验
        for (const pattern of patterns) {
            if (pattern.test(cleanedStr)) {
                res.VerifyState = FormResult.OK
                return res
            }
        }

        // 错误提示
        res.VerifyText = '电话号码格式不正确'
        res.VerifyState = FormResult.Error
        return res
    }

    /** 是否“为合法邮箱地址” */
    static IsValidEmail(str?: string, isAllowUndefined: boolean = true): VerifyResult {
        const res = new VerifyResult()

        // 允许为空
        if (isAllowUndefined && (str === undefined || str === null || str === '')) {
            return res
        }

        // 空值检查
        if (str === undefined || str === null || str.trim() === '') {
            res.VerifyText = '邮箱不能为空'
            res.VerifyState = FormResult.Error
            return res
        }

        // 总长度校验（RFC标准最大254字符）
        const maxLength = 254
        if (str.length > maxLength) {
            res.VerifyText = `邮箱长度不能超过${maxLength}字符`
            res.VerifyState = FormResult.Error
            return res
        }

        // 检查是否包含@符号
        const atIndex = str.indexOf('@')
        if (atIndex === -1) {
            res.VerifyText = '邮箱必须包含@符号'
            res.VerifyState = FormResult.Error
            return res
        }

        // 本地部分和域名部分提取
        const localPart = str.substring(0, atIndex)
        const domainPart = str.substring(atIndex + 1)

        // 本地部分长度校验（RFC标准最大64字符）
        if (localPart.length > 64) {
            res.VerifyText = '邮箱本地部分不能超过64字符'
            res.VerifyState = FormResult.Error
            return res
        }

        // 域名部分长度校验（RFC标准最大253字符）
        if (domainPart.length > 253) {
            res.VerifyText = '邮箱域名部分不能超过253字符'
            res.VerifyState = FormResult.Error
            return res
        }

        // 域名标签校验（每个标签1-63字符，仅允许a-z/0-9/-，且不能以-开头/结尾）
        const domainLabels = domainPart.toLowerCase().split('.')
        for (const label of domainLabels) {
            if (label.length === 0 || label.length > 63) {
                res.VerifyText = '域名标签长度无效（1-63字符）'
                res.VerifyState = FormResult.Error
                return res
            }

            if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) {
                res.VerifyText = '域名标签包含无效字符'
                res.VerifyState = FormResult.Error
                return res
            }
        }

        // 格式校验（RFC兼容正则表达式）
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

        if (!emailRegex.test(str)) {
            res.VerifyText = '邮箱格式不正确'
            res.VerifyState = FormResult.Error
            return res
        }

        // 特殊字符位置校验
        if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
            res.VerifyText = '本地部分不能以点开头/结尾或连续出现两个点'
            res.VerifyState = FormResult.Error
            return res
        }

        // 通过所有校验
        res.VerifyState = FormResult.OK
        return res
    }
}