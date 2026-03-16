// Action:
export type Action = () => void
export type BooleanAction = () => boolean
export type NumberAction = () => number
export type ObjectAction = () => object
export type StringAction = () => string
export type TObjectAction<T extends object> = () => T

// Func:
export type BooleanFunc = (bool: boolean) => void
export type NumberFunc = (num: number) => void
export type ObjectFunc = (obj: object) => void
export type ObjectArrayFunc = (arr: object[]) => void
export type Object2StringFunc = (obj?: object) => string
export type StringFunc = (str: string) => void
export type StringArrayFunc = (arr: string[]) => void
export type AnyFunc = (value: any) => void
export type AnyArrayFunc = (arr: any[]) => void
export type Any2StringFunc = (value: any) => string
export type UnknownFunc = (value: unknown, oldValue?: unknown) => void
export type UnknownArrayFunc = (arr: unknown[]) => void

// getter\setter:
export type BooleanGetter = (obj: object) => boolean
export type BooleanSetter = (obj: object, bool: boolean) => void
export type StringGetter = (obj: object, propName: string) => string
export type UnknownGetter = (obj: object, propName: string) => unknown
export type UnknownSetter = (obj: object, propName: string, value: unknown) => void

// Other:
export const AnyTypes = [String, Number, Boolean, Object, Array, Symbol, Function, Date, null, undefined]