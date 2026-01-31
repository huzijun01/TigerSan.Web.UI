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