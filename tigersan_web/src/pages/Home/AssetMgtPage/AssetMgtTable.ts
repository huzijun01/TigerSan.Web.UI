import { ObjectHelper, PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'
import { AssetModel, AssetState } from '@/models'

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** 列头 */
const assetMgtTable = new TableModel<AssetModel>([
    {
        _propName: 'companyName',
        Text: '公司',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'departmentName',
        Text: '部门',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'assetId',
        Text: '资产ID',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'tagId',
        Text: '标签ID',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'typeName',
        Text: '类型',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'state',
        Text: '状态',
        IsReadonly: true,
        IsAllowWrap: false,
        _getString: source => AssetState.GetName(source.state)
    },
    {
        _propName: 'comment',
        Text: '备注',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'binding_time',
        Text: '绑定时间',
        IsReadonly: true,
        IsAllowWrap: false,
        _getString: source => ObjectHelper.GetDateString(source.bindingTime)
    },
    {
        _propName: 'dailyMove',
        Text: '日周转',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'monthlyMove',
        Text: '月周转',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'totalMove',
        Text: '总周转',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'stayDuration',
        Text: '在库停留时长（时）',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'unreportDuration',
        Text: '未上报时长（时）',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'travelDuration',
        Text: '在途时长（时）',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])

// 初始化:
assetMgtTable.IsAllowMultiSelect.value = false

export {
    pagination,
    assetMgtTable,
}