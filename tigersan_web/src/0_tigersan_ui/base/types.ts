// Class:
class Int {
    // 字段:
    private _value = 0
    _set?: NumberFunc

    // 引用:
    get value() {
        return this._value
    }
    set value(num) {
        if (isNaN(num)) {
            console.log('The num is NaN!')
            return
        }

        this._value = Math.floor(num)

        if (this._set) {
            this._set(this._value)
        }
    }

    // Ctor:
    constructor(num?: number, set?: NumberFunc) {
        if (num != undefined) this.value = num
        this._set = set
    }

    // 方法:
    Add(int: Int) {
        this.value = this._value + int.value;
    }

    Sub(int: Int) {
        this.value = this._value - int.value;
    }

    Mul(int: Int) {
        this.value = this._value * int.value;
    }

    Div(int: Int) {
        // 防止除零错误
        if (int.value === 0) throw new Error("Division by zero")
        this.value = Math.floor(this._value / int.value)
    }

    Mod(int: Int) {
        if (int.value === 0) throw new Error("Division by zero")
        this.value = this._value % int.value;
    }

    static Div(a: Int, b: Int): number {
        // 防止除零错误
        if (b.value === 0) throw new Error("Division by zero")
        return Math.floor(a.value / b.value)
    }

    static Mod(a: Int, b: Int): number {
        if (b.value === 0) throw new Error("Division by zero")
        return a.value % b.value
    }
}

// Action:
type Action = () => void
type TryAction = Action | undefined
type NumberAction = () => number
type TryNumberAction = NumberAction | undefined
type BooleanAction = () => boolean
type TryBooleanAction = BooleanAction | undefined
type StringAction = () => string
type TryStringAction = StringAction | undefined

// Func:
type NumberFunc = (num: number) => void
type TryNumberFunc = NumberFunc | undefined
type StringFunc = (str: string) => void
type TryStringFunc = StringAction | undefined
type StringArrayFunc = (arr: string[]) => void
type TryStringArrayFunc = StringArrayFunc | undefined
type StringGetter = (obj: object, propName: string) => string
type TryStringGetter = StringGetter | undefined
type ObjectSetter = (obj: object, propName: string, value: any) => void
type TryObjectSetter = ObjectSetter | undefined
type Object2StringFunc = (obj?: object) => string
type TryObject2StringFunc = Object2StringFunc | undefined

export {
    // Class:
    Int,

    // Action:
    type Action,
    type TryAction,
    type NumberAction,
    type TryNumberAction,
    type BooleanAction,
    type TryBooleanAction,
    type StringAction,
    type TryStringAction,

    // Func:
    type NumberFunc,
    type TryNumberFunc,
    type StringFunc,
    type TryStringFunc,
    type StringArrayFunc,
    type TryStringArrayFunc,
    type StringGetter,
    type TryStringGetter,
    type ObjectSetter,
    type TryObjectSetter,
    type Object2StringFunc,
    type TryObject2StringFunc,
}