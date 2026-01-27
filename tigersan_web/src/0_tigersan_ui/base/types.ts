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
type StringGetter = (obj: object, propName: string) => string
type TryStringGetter = StringGetter | undefined
type ObjectSetter = (obj: object, propName: string, value: any) => void
type TryObjectSetter = ObjectSetter | undefined

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
    type StringGetter,
    type TryStringGetter,
    type ObjectSetter,
    type TryObjectSetter,
}