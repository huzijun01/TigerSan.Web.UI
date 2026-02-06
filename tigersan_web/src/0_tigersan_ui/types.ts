// Action:
type Action = () => void
type BooleanAction = () => boolean
type NumberAction = () => number
type ObjectAction = () => object
type StringAction = () => string

// Func:
type BooleanFunc = (bool: boolean) => void
type NumberFunc = (num: number) => void
type ObjectFunc = (obj: object) => void
type ObjectArrayFunc = (arr: object[]) => void
type Object2StringFunc = (obj?: object) => string
type StringFunc = (str: string) => void
type StringArrayFunc = (arr: string[]) => void

// getter\setter:
type BooleanGetter = (obj: object) => boolean
type BooleanSetter = (obj: object, bool: boolean) => void
type StringGetter = (obj: object, propName: string) => string
type UnknownGetter = (obj: object, propName: string) => unknown
type UnknownSetter = (obj: object, propName: string, value: unknown) => void

export {
    // Action:
    type Action,
    type BooleanAction,
    type NumberAction,
    type ObjectAction,
    type StringAction,

    // Func:
    type BooleanFunc,
    type NumberFunc,
    type ObjectFunc,
    type ObjectArrayFunc,
    type Object2StringFunc,
    type StringFunc,
    type StringArrayFunc,

    // getter\setter:
    type BooleanGetter,
    type BooleanSetter,
    type StringGetter,
    type UnknownGetter,
    type UnknownSetter,
}