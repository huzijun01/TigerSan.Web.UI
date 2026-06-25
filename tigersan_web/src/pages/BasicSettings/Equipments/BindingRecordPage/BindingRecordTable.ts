import { BindingRecordModel, IsBinding } from '@/models'
import { ItemType, ObjectHelper, TableModel } from '@/0_tigersan_ui/tigerui'

/** 列头 */
export function GetTableModel() {
    const table = new TableModel<BindingRecordModel>([
        {
            _propName: 'tagId',
            Text: '标签ID',
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'assetId',
            Text: '资产ID',
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'isBinding',
            Text: '操作',
            IsReadonly: true,
            Type: ItemType.TextBox,
            _getString: IsBinding.GetString
        },
        {
            _propName: 'time',
            Text: '时间',
            IsReadonly: true,
            Type: ItemType.TextBox,
            _getString: source => ObjectHelper.GetDateString(source.time)
        },
    ])

    // 初始化:
    table.IsAllowMultiSelect.value = false

    table._initItem = itemModel => {
        IsBinding.InitItemModel(itemModel)
    }

    return table
}