import { companyMgtHelper, siteTypeMgtHelper, SiteModel } from '@/models'
import { TableModel } from '@/0_tigersan_ui/tigerui'

/** 列头 */
const siteMgtTable = new TableModel<SiteModel>([
    // {
    //     _propName: 'id',
    //     Text: 'ID',
    //     Width: 50,
    //     IsReadonly: true,
    //     IsAllowWrap: false,
    // },
    {
        _propName: 'company',
        Text: '公司',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => companyMgtHelper.GetName(source.company)
    },
    {
        _propName: 'type',
        Text: '类型',
        IsReadonly: true,
        IsAllowWrap: false,
        _getStringAsync: source => siteTypeMgtHelper.GetName(source.type)
    },
    {
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'addr',
        Text: '地址',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'addrDetail',
        Text: '详细地址',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'manager',
        Text: '联系人',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'phone',
        Text: '电话',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'comment',
        Text: '备注',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 初始化:
siteMgtTable.IsAllowMultiSelect.value = false

export {
    siteMgtTable,
}