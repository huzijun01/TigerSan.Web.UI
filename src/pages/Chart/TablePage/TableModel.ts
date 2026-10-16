import { Gender, ItemType, ObjectHelper, TableModel, Texts } from '../../../packages'
import { PersonModel } from './PersonModel'

/** 列头 */
export const personTable = new TableModel<PersonModel>([
    {
        _propName: 'id',
        Text: 'ID',
        IsFreeze: true,
        IsReadonly: true,
        IsShowSlot: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'name',
        Text: Texts.Name,
        IsFreeze: true,
        IsReadonly: true,
        IsShowSlot: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'age',
        Text: Texts.Age,
        IsReadonly: true,
        IsShowSlot: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'gender',
        Text: Texts.Gender,
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: Gender.GetString
    },
    {
        _propName: 'salary',
        Text: Texts.Salary,
        IsReadonly: true,
        IsShowSlot: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'joiningTime',
        Text: Texts.JoiningTime,
        IsReadonly: true,
        IsShowSlot: true,
        Type: ItemType.TextBox,
        _getString: source => ObjectHelper.GetDateString(source.joiningTime)
    },
])

// 初始化:
personTable.IsAllowMultiSelect.value = false