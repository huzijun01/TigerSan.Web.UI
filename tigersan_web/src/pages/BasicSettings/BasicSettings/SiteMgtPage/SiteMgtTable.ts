import { companyHelper, siteTypeHelper, SiteModel } from '@/models'
import { ItemType, TableModel } from '@/0_tigersan_ui/tigerui'

/** 列头 */
const siteMgtTable = new TableModel<SiteModel>([
    {
        _propName: 'company',
        Text: '公司',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => companyHelper.GetNameAsync(source.company)
    },
    {
        _propName: 'type',
        Text: '类型',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getStringAsync: source => siteTypeHelper.GetNameAsync(source.type)
    },
    {
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'addr',
        Text: '地址',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'addrDetail',
        Text: '详细地址',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    // {
    //     _propName: 'longitude',
    //     Text: '经纬度',
    //     IsReadonly: true,
    //     Type: ItemType.TextBox,
    //     _getString: source => `${source.longitude}, ${source.latitude}`
    // },
    {
        _propName: 'manager',
        Text: '联系人',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'phone',
        Text: '电话',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'comment',
        Text: '备注',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
])

// 初始化:
siteMgtTable.IsAllowMultiSelect.value = false

export {
    siteMgtTable,
}