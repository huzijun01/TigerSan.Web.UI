export class ObjectHelper {
    /** “对象”浅复制 */
    static ObjectShallowCopy<TSource extends object>(obj: TSource): TSource {
        // 处理基本类型直接返回
        if (obj === null || typeof obj != 'object') {
            return obj as TSource;
        }

        // 获取原型并创建新对象
        const proto = Object.getPrototypeOf(obj);
        const copy = Object.create(proto);

        // 复制所有自身字段（包括不可枚举字段和 Symbol）
        const keys = Reflect.ownKeys(obj);
        for (const key of keys) {
            copy[key as keyof TSource] = obj[key as keyof TSource];
        }

        return copy;
    }


    /** “对象”深复制 */
    static ObjectDeepCopy<TSource extends object>(obj: TSource): TSource {
        const hash = new WeakMap<object, any>();

        function _copy(obj: any): any {
            // 处理基本类型和函数
            if (obj === null || typeof obj != 'object') {
                return obj;
            }

            // 处理循环引用
            if (hash.has(obj)) {
                return hash.get(obj);
            }

            // 处理特殊类型
            switch (true) {
                case obj instanceof Date:
                    return new Date(obj.getTime());
                case obj instanceof RegExp:
                    return new RegExp(obj);
                // case ArrayBuffer.isView(obj): // 处理 TypedArray
                //     return obj.slice();
                case obj instanceof ArrayBuffer:
                    return obj.slice(0);
                case obj instanceof Map:
                    const mapCopy = new Map();
                    hash.set(obj, mapCopy);
                    obj.forEach((value, key) => {
                        mapCopy.set(_copy(key), _copy(value));
                    });
                    return mapCopy;
                case obj instanceof Set:
                    const setCopy = new Set();
                    hash.set(obj, setCopy);
                    obj.forEach(value => {
                        setCopy.add(_copy(value));
                    });
                    return setCopy;
            }

            // 处理数组
            if (Array.isArray(obj)) {
                const arrCopy = [...obj];
                hash.set(obj, arrCopy);
                for (let i = 0; i < arrCopy.length; i++) {
                    arrCopy[i] = _copy(arrCopy[i]);
                }
                return arrCopy;
            }

            // 处理普通对象
            const proto = Object.getPrototypeOf(obj);
            const objCopy = Object.create(proto);
            hash.set(obj, objCopy);

            // 复制所有自身字段（包括不可枚举和 Symbol）
            const keys = Reflect.ownKeys(obj);
            for (const key of keys) {
                objCopy[key] = _copy(obj[key]);
            }

            return objCopy;
        }

        return _copy(obj);
    }

    /** 默认“对象行为”  */
    static DefaultObjectAction() { return {} }

    /** 获取“字段文本”默认方法 */
    static DefaultStringGetter(obj: object, propName: string): string {
        const value = (obj as Record<string, unknown>)[propName]
        if (value === undefined || value === null) return ''
        return String(value)
    }

    /** 获取“字段值”默认方法 */
    static DefaultNumberGetter(obj: object, propName: string): number {
        const value = (obj as Record<string, unknown>)[propName]

        // 处理 null/undefined 和其他类型的转换
        return value != null ? Number(value) : 0
    }

    /** 修改“字段值”默认方法 */
    static DefaultTGetter<TValue>(obj: object, propName: string, defaultValue: TValue): TValue {
        return (obj as Record<string, TValue>)[propName] ?? defaultValue
    }

    /** 修改“字段值”默认方法 */
    static DefaultTSetter<TValue>(obj: object, propName: string, value: TValue): void {
        (obj as Record<string, TValue>)[propName] = value;
    }

    /** 判断“字段文本”是否等于“目标值”  */
    static IsTextEqual<TValue>(obj: object, propName: string, value: TValue): boolean {
        return ObjectHelper.DefaultStringGetter(obj, propName) === value
    }

    /** 判断“字段值”是否等于“目标值”  */
    static IsSourceEqual<TValue>(obj: object, propName: string, value: TValue, defaultValue?: unknown): boolean {
        return ObjectHelper.DefaultTGetter(obj, propName, defaultValue) === value
    }
}