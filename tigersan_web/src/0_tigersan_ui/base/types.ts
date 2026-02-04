import { Int } from "./types/Int"

// Action:
type Action = () => void
type BooleanAction = () => boolean
type NumberAction = () => number
type ObjectAction = () => object
type StringAction = () => string

// Func:
type BooleanFunc = (bool: boolean) => void
type BooleanGetter = (obj: object) => boolean
type BooleanSetter = (obj: object, bool: boolean) => void
type NumberFunc = (num: number) => void
type ObjectFunc = (obj: object) => void
type ObjectArrayFunc = (arr: object[]) => void
type ObjectSetter = (obj: object, propName: string, value: any) => void
type Object2StringFunc = (obj?: object) => string
type StringFunc = (str: string) => void
type StringArrayFunc = (arr: string[]) => void
type StringGetter = (obj: object, propName: string) => string

export {
    // Class:
    Int,

    // Action:
    type Action,
    type BooleanAction,
    type NumberAction,
    type ObjectAction,
    type StringAction,

    // Func:
    type BooleanFunc,
    type BooleanGetter,
    type BooleanSetter,
    type NumberFunc,
    type ObjectFunc,
    type ObjectArrayFunc,
    type ObjectSetter,
    type Object2StringFunc,
    type StringFunc,
    type StringArrayFunc,
    type StringGetter,
}