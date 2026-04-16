import { Colors, ItemType, ObjectHelper, OnlineState, OnlineStates, PaginationModel, TableModel } from '@/0_tigersan_ui/tigerui'
import { AssetModel, AssetState, AssetStates } from '@/models'

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
        Type: ItemType.TextBox,
    },
    {
        _propName: 'departmentName',
        Text: '部门',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'assetId',
        Text: '资产ID',
        IsReadonly: true,
        Type: ItemType.Link,
        _onItemClick: () => { }
    },
    {
        _propName: 'tagId',
        Text: '标签ID',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'name',
        Text: '名称',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'typeName',
        Text: '类型',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'state',
        Text: '状态',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: source => AssetState.GetName(source.state)
    },
    {
        _propName: 'onlineState',
        Text: '在线状态',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: source => OnlineState.ToString(source.onlineState)
    },
    {
        _propName: 'comment',
        Text: '备注',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'bindingTime',
        Text: '绑定时间',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: source => ObjectHelper.GetDateString(source.bindingTime)
    },
    {
        _propName: 'calculationTime',
        Text: '计算时间',
        IsReadonly: true,
        Type: ItemType.TextBox,
        _getString: source => ObjectHelper.GetDateString(source.calculationTime)
    },
    {
        _propName: 'dailyMove',
        Text: '日周转',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'monthlyMove',
        Text: '月周转',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'totalMove',
        Text: '总周转',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'stayDuration',
        Text: '在库停留时长（时）',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'travelDuration',
        Text: '在途时长（时）',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
    {
        _propName: 'offlineDuration',
        Text: '离线时长（时）',
        IsReadonly: true,
        Type: ItemType.TextBox,
    },
])

// 初始化:
assetMgtTable.IsAllowMultiSelect.value = false

assetMgtTable._initItem = itemModel => {
    if (itemModel._headerModel._propName === 'state') {
        const source = itemModel.GetSource()
        if (source === AssetStates.InTransit) {
            itemModel.Color.value = Colors.Success
            itemModel.Background.value = Colors.Success10
        } else if (source === AssetStates.Stolid) {
            itemModel.Color.value = Colors.Warning
            itemModel.Background.value = Colors.Warning10
        } else if (source === AssetStates.Outbound) {
            itemModel.Color.value = Colors.Info
            itemModel.Background.value = Colors.Info10
        } else if (source === AssetStates.NoRecord) {
            itemModel.Color.value = Colors.Danger
            itemModel.Background.value = Colors.Danger10
        } else {
            itemModel.Color.value = Colors.Brand
            itemModel.Background.value = Colors.Brand10
        }
    }

    if (itemModel._headerModel._propName === 'onlineState') {
        if (itemModel.GetSource() === OnlineStates.Online) {
            itemModel.Color.value = Colors.Success
            itemModel.Background.value = Colors.Success10
        } else {
            itemModel.Color.value = Colors.Danger
            itemModel.Background.value = Colors.Danger10
        }
    }
}

export {
    pagination,
    assetMgtTable,
}