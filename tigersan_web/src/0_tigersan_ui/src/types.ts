// Action:
export type Action = () => void
export type TAction<T> = () => T
export type NumberAction = () => number
export type StringAction = () => string
export type ObjectAction = () => object
export type BooleanAction = () => boolean
export type ActionAsync = () => Promise<void>
export type TObjectAction<T extends object> = () => T

// Func:
export type TFunc<T> = (value: T) => void
export type NumberFunc = (num: number) => void
export type StringFunc = (str: string) => void
export type ObjectFunc = (obj: object) => void
export type BooleanFunc = (bool: boolean) => void
export type UnknownFunc = (value: unknown) => void
export type TFuncAsync<T> = (value: T) => Promise<void>
export type NumberFuncAsync = (num: number) => Promise<void>
export type StringFuncAsync = (str: string) => Promise<void>
export type ObjectFuncAsync = (obj: object) => Promise<void>
export type BooleanFuncAsync = (bool: boolean) => Promise<void>
export type UnknownFuncAsync = (value: unknown) => Promise<void>

// Array Func:
export type TArrayFunc<T> = (arr: T[]) => void
export type NumberArrayFunc = (arr: number[]) => void
export type StringArrayFunc = (arr: string[]) => void
export type ObjectArrayFunc = (arr: object[]) => void
export type BooleanArrayFunc = (arr: boolean[]) => void
export type UnknownArrayFunc = (arr: unknown[]) => void
export type TObjectArrayFunc<T extends object> = (arr: T[]) => void

// string getter:
export type T2String<T> = (value: T) => string
export type Any2String = (value: any) => string
export type Object2String = (obj?: object) => string

// getter\setter:
export type BooleanGetter = (obj: object) => boolean
export type BooleanSetter = (obj: object, bool: boolean) => void
export type StringGetter = (obj: object, propName: string) => string
export type UnknownGetter = (obj: object, propName: string) => unknown
export type UnknownSetter = (obj: object, propName: string, value: unknown) => void
export type TStringGetter<TSource extends object> = (obj: TSource, propName: string) => string
export type TStringGetterAsync<TSource extends object> = (obj: TSource, propName: string) => Promise<string>
export type TGetter<TSource extends object, TTarget> = (obj: TSource, propName: string) => TTarget | undefined
export type TGetterAsync<TSource extends object, TTarget> = (obj: TSource, propName: string) => Promise<TTarget | undefined>
export type TSetter<TSource extends object, TTarget> = (obj: TSource, propName: string, value: TTarget) => void

// change:
export type TChange<T> = (value: T, oldValue?: T) => void
export type UnknownChange = (value: unknown, oldValue?: unknown) => void

// Other:
export const AnyTypes = [String, Number, Boolean, Object, Array, Symbol, Function, Date, null, undefined]