export class ObjectHelper {
    /** 浅复制“字段值” */
    static ShallowSet<TSource extends object, TTarget extends object>(src: TSource, dest: TTarget): void {
        for (const [k, v] of Object.entries(src)) {
            if (k in dest) {
                dest[k as keyof TTarget] = v as TTarget[keyof TTarget]
            }
        }
    }

    /** 浅复制 */
    static ShallowCopy<TSource extends object>(obj: TSource): TSource {
        // 处理基本类型直接返回
        if (obj === null || typeof obj != 'object') {
            return obj as TSource
        }

        // 获取原型并创建新对象
        const proto = Object.getPrototypeOf(obj)
        const copy = Object.create(proto)

        // 复制所有自身字段（包括不可枚举字段和 Symbol）
        const keys = Reflect.ownKeys(obj)
        for (const key of keys) {
            copy[key as keyof TSource] = obj[key as keyof TSource]
        }

        return copy
    }

    /** 深复制 */
    static DeepCopy<TSource extends object>(obj: TSource): TSource {
        const hash = new WeakMap<object, any>()

        function _copy(obj: any): any {
            // 处理基本类型和函数
            if (obj === null || typeof obj != 'object') {
                return obj
            }

            // 处理循环引用
            if (hash.has(obj)) {
                return hash.get(obj)
            }

            // 处理特殊类型
            switch (true) {
                case obj instanceof Date:
                    return new Date(obj.getTime())
                case obj instanceof RegExp:
                    return new RegExp(obj)
                // case ArrayBuffer.isView(obj): // 处理 TypedArray
                //     return obj.slice()
                case obj instanceof ArrayBuffer:
                    return obj.slice(0)
                case obj instanceof Map:
                    const mapCopy = new Map()
                    hash.set(obj, mapCopy)
                    obj.forEach((value, key) => {
                        mapCopy.set(_copy(key), _copy(value))
                    })
                    return mapCopy
                case obj instanceof Set:
                    const setCopy = new Set()
                    hash.set(obj, setCopy)
                    obj.forEach(value => {
                        setCopy.add(_copy(value))
                    })
                    return setCopy
            }

            // 处理数组
            if (Array.isArray(obj)) {
                const arrCopy = [...obj]
                hash.set(obj, arrCopy)
                for (let i = 0; i < arrCopy.length; i++) {
                    arrCopy[i] = _copy(arrCopy[i]);
                }
                return arrCopy
            }

            // 处理普通对象
            const proto = Object.getPrototypeOf(obj)
            const objCopy = Object.create(proto)
            hash.set(obj, objCopy)

            // 复制所有自身字段（包括不可枚举和 Symbol）
            const keys = Reflect.ownKeys(obj)
            for (const key of keys) {
                objCopy[key] = _copy(obj[key])
            }

            return objCopy
        }

        return _copy(obj)
    }

    /** 修改“字段值”默认方法 */
    static DefaultTGetter<TValue>(obj: object, propName: string, defaultValue?: TValue): TValue | undefined {
        return (obj as Record<string, TValue>)[propName] ?? defaultValue
    }

    /** 修改“字段值”默认方法 */
    static DefaultTSetter<TValue>(obj: object, propName: string, value: TValue): void {
        (obj as Record<string, TValue>)[propName] = value;
    }

    /** 默认“对象行为”  */
    static DefaultObjectAction() { return {} }

    /** 获取“字段文本”默认方法 */
    static DefaultStringGetter(obj: object, propName: string): string {
        const value = (obj as Record<string, unknown>)[propName]
        if (value === undefined || value === null) return ''
        return String(value)
    }

    /** 获取“数字值”默认方法 */
    static DefaultNumberGetter(obj: object, propName: string): number {
        const value = (obj as Record<string, unknown>)[propName]

        // 处理 null/undefined 和其他类型的转换
        return value != null ? Number(value) : 0
    }

    /** 获取“日期文本”默认方法 */
    static DefaultDateStringGetter(obj: object, propName: string): string {
        const value = (obj as Record<string, unknown>)[propName]
        if (!(value instanceof Date || typeof value === 'string' || typeof value === 'number')) {
            console.warn('The value type is incorrect!')
            return ''
        }
        return this.GetDateString(value)
    }

    /** 获取“日期文本” */
    static GetDateString(value?: Date | number | string) {
        if (value === undefined
            || value === null
            || typeof value === 'string' && value.trim() === ''
            || typeof value === 'number' && value < 1) {
            return ''
        }

        const toLocalDate = (date: Date) => {
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
        }

        if (value instanceof Date) {
            return toLocalDate(value)
        }

        // 统一转换为UTC时间对象
        const utcDate = new Date(
            typeof value === 'string' && !value.includes('Z')
                ? value + 'Z'
                : value
        )

        // 转换为本地时间
        return toLocalDate(new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000))
    }

    /** 判断“字段文本”是否等于“目标值”  */
    static IsTextEqual<TValue>(obj: object, propName: string, value: TValue): boolean {
        return ObjectHelper.DefaultStringGetter(obj, propName) === value
    }

    /** 判断“字段值”是否等于“目标值”  */
    static IsSourceEqual<TValue>(obj: object, propName: string, value: TValue): boolean {
        return ObjectHelper.DefaultTGetter(obj, propName) === value
    }

    /** 判断“是否为空” */
    static IsNullOrUndefined(v?: unknown): boolean {
        return v === null || v === undefined
    }

    /** 判断“是否不为空” */
    static IsNotNullOrUndefined(v?: unknown): boolean {
        return v != null && v != undefined
    }

    /** 判断“类型是否相同” */
    static IsSameType(a: unknown, b: unknown, isIgnoreUndefinedOrNull: boolean = true): boolean {
        // 是否忽略undefined和null:
        if (isIgnoreUndefinedOrNull && (ObjectHelper.IsNullOrUndefined(a) || ObjectHelper.IsNullOrUndefined(b))) {
            return true
        } else {
            // 处理 null 的特殊情况:
            if (a === null && b === null) return true
            if (a === null || b === null) return false

            // 处理 undefined 的特殊情况:
            if (a === undefined && b === undefined) return true
            if (a === undefined || b === undefined) return false
        }

        // 获取基础类型:
        const aType = typeof a
        const bType = typeof b

        // 基础类型不同直接返回 false:
        if (aType !== bType) return false

        // 处理原始类型（排除 object 和 function）:
        if (aType !== 'object' && aType !== 'function') {
            return true
        }

        // 处理对象类型和函数
        const aTag = Object.prototype.toString.call(a)
        const bTag = Object.prototype.toString.call(b)

        return aTag === bTag
    }
}