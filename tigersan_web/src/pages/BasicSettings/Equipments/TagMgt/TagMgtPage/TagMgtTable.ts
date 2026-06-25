import { Battery, IsEnable, IsFall, ItemType, ObjectHelper, OnlineState, Signal, TableModel } from '@/0_tigersan_ui/tigerui'
import { TagModel, batchHelper, tagTypeHelper, baseStationHelper } from '@/models'

// 列头:
export function GetTable() {
    const table = new TableModel<TagModel>([
        {
            _propName: 'companyName',
            Text: '公司',
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'batch',
            Text: '批次',
            IsReadonly: true,
            Type: ItemType.TextBox,
            _getStringAsync: source => batchHelper.GetValue(source.batch)
        },
        {
            _propName: 'type',
            Text: '类型',
            IsReadonly: true,
            Type: ItemType.TextBox,
            _getStringAsync: source => tagTypeHelper.GetNameAsync(source.type)
        },
        {
            _propName: 'station',
            Text: '基站',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
            _getStringAsync: source => baseStationHelper.GetNameAsync(source.station)
        },
        {
            _propName: 'siteName',
            Text: '场地',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'isEnable',
            Text: '激活状态',
            IsReadonly: true,
            Type: ItemType.TextBox,
            _getString: IsEnable.GetString,
        },
        {
            _propName: 'onlineState',
            Text: '在线状态',
            IsReadonly: true,
            Type: ItemType.TextBox,
            _getString: OnlineState.GetString,
        },
        {
            _propName: 'isFall',
            Text: '是否脱落',
            IsReadonly: true,
            Type: ItemType.TextBox,
            _getString: IsFall.GetString,
        },
        {
            _propName: 'tagId',
            Text: '标签ID',
            IsFreeze: true,
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'assetId',
            Text: '资产ID',
            IsFreeze: true,
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'rfid',
            Text: 'RFID',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'imei',
            Text: 'IMEI',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'iccid',
            Text: 'ICCID',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'battery',
            Text: '电量',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'signal',
            Text: '信号',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'longitude',
            Text: '经度',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'latitude',
            Text: '维度',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'temperature',
            Text: '设备温度',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'comment',
            Text: '备注',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'reportTime',
            Text: '上报时间',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
            _getString: source => ObjectHelper.GetDateString(source.reportTime)
        },
        {
            _propName: 'address',
            Text: '地址',
            IsReadonly: true,
            IsRequired: false,
            Type: ItemType.TextBox,
        },
    ])

    // 初始化:
    table.IsAllowMultiSelect.value = true

    table._initItem = itemModel => {
        IsEnable.InitItemModel(itemModel)
        IsFall.InitItemModel(itemModel)
        OnlineState.InitItemModel(itemModel)
        Signal.InitItemModel(itemModel)
        Battery.InitItemModel(itemModel)
    }

    return table
}