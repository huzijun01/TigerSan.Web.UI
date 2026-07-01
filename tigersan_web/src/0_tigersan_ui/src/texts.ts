import { TextModel } from "./models/Text/TextModel"

/** 文本集合 */
export class Texts {
    // A:
    static readonly Add = TextModel.Computed('Add', '新增')
    static readonly All = TextModel.Computed('All', '全部')
    static readonly Auto = TextModel.Computed('Auto', '自动')
    static readonly Addr = TextModel.Computed('Addr', '地址')
    static readonly Asset = TextModel.Computed('Asset', '资产')
    static readonly Address = TextModel.Computed('Address', '地址')
    static readonly AllotMode = TextModel.Computed('AllotMode', '调拨方式')
    static readonly AssetType = TextModel.Computed('AssetType', '资产类型')
    static readonly AssetState = TextModel.Computed('AssetState', '资产状态')
    static readonly AssetDetail = TextModel.Computed('AssetDetail', '资产详情')
    static readonly AddedSuccessfully = TextModel.Computed('Added successfully', '添加成功')
    // B:
    static readonly Batch = TextModel.Computed('Batch', '批次')
    static readonly Bound = TextModel.Computed('Bound', '已绑定')
    static readonly Binding = TextModel.Computed('Binding', '绑定')
    static readonly Battery = TextModel.Computed('Battery', '电量')
    static readonly Breakdown = TextModel.Computed('Breakdown', '故障')
    static readonly Business = TextModel.Computed('Business', '业务平台')
    static readonly BaseStation = TextModel.Computed('BaseStation', '基站')
    static readonly BasicDetail = TextModel.Computed('BasicDetail', '基础详情')
    static readonly BasicSettings = TextModel.Computed('BasicSettings', '基础设置')
    // C:
    static readonly Colon = TextModel.Computed(': ', '：')
    static readonly Clear = TextModel.Computed('Clear', '清空')
    static readonly Count = TextModel.Computed('Count', '总数')
    static readonly Cancel = TextModel.Computed('Cancel', '取消')
    static readonly Comment = TextModel.Computed('Comment', '备注')
    static readonly Company = TextModel.Computed('Company', '公司')
    static readonly CannotBeEmpty = TextModel.Computed('Cannot be empty', '不可为空')
    static readonly ChangePassword = TextModel.Computed('Change password ', '修改密码')
    // D:
    static readonly Done = TextModel.Computed('Done', '完成')
    static readonly Delete = TextModel.Computed('Delete', '删除')
    static readonly Disable = TextModel.Computed('Disable', '禁用')
    static readonly Department = TextModel.Computed('Department', '部门')
    // E:
    static readonly Empty = TextModel.Computed('', '')
    static readonly End = TextModel.Computed('End', '结束')
    static readonly Edit = TextModel.Computed('Edit', '修改')
    static readonly Enable = TextModel.Computed('Enable', '启用')
    static readonly ErrorType = TextModel.Computed('ErrorType', '异常类型')
    // F:
    static readonly Fall = TextModel.Computed('Fall', '脱落')
    static readonly FallDetect = TextModel.Computed('FallDetect', '脱落检测')
    // H:
    static readonly Help = TextModel.Computed('Help', '帮助')
    // I:
    static readonly Is = TextModel.Computed('Is', '是否')
    static readonly IsFall = TextModel.Computed('IsFall', '是否脱落')
    static readonly Inbound = TextModel.Computed('Inbound', '入库')
    static readonly InStore = TextModel.Computed('InStore', '在库')
    static readonly InTransit = TextModel.Computed('InTransit', '在途')
    static readonly IsReadonly = TextModel.Computed('IsReadonly: ', '是否只读：')
    static readonly InTransitTimeout = TextModel.Computed('InTransitTimeout', '在途超时')
    static readonly IncorrectCaptcha = TextModel.Computed('Incorrect captcha!', '验证码不正确')
    // L:
    static readonly Lose = TextModel.Computed('Lose', '丢失')
    static readonly Login = TextModel.Computed('Login', '登录')
    static readonly Language = TextModel.Computed('Language', '语言')
    static readonly Locator = TextModel.Computed('Locator', '定位器')
    static readonly LastReportTime = TextModel.Computed('LastReportTime', '最后上报时间')
    // M:
    static readonly Manual = TextModel.Computed('Manual', '手动')
    // N:
    static readonly No = TextModel.Computed('No', '否')
    static readonly Null = TextModel.Computed('null', 'null')
    static readonly Name = TextModel.Computed('Name', '名称')
    static readonly Normal = TextModel.Computed('Normal', '正常')
    static readonly NoSignal = TextModel.Computed('NoSignal', '无信号')
    static readonly NoRecord = TextModel.Computed('NoRecord', '无记录')
    static readonly NoContent = TextModel.Computed('No Content', '无内容')
    // O:
    static readonly Ok = TextModel.Computed('Ok', '确定')
    static readonly Online = TextModel.Computed('Online', '在线')
    static readonly Offline = TextModel.Computed('Offline', '离线')
    static readonly Outbound = TextModel.Computed('Outbound', '出库')
    static readonly OnlineState = TextModel.Computed('OnlineState', '在线状态')
    // P:
    static readonly page = TextModel.Computed('page', '页')
    static readonly Progress = TextModel.Computed('Progress', '进度')
    static readonly PleaseEnter = TextModel.Computed('Please enter.', '请输入')
    static readonly PleaseSelect = TextModel.Computed('Please select.', '请选择')
    static readonly PleaseEnterANumber = TextModel.Computed('Please enter a number', '请输入数字')
    // R:
    static readonly Repair = TextModel.Computed('Repair', '维修')
    static readonly Refresh = TextModel.Computed('Refresh', '刷新')
    static readonly ReportTime = TextModel.Computed('ReportTime', '上报时间')
    // S:
    static readonly Save = TextModel.Computed('Save', '保存')
    static readonly Site = TextModel.Computed('Site', '场地')
    static readonly State = TextModel.Computed('State', '状态')
    static readonly Stolid = TextModel.Computed('Stolid', '滞留')
    static readonly Select = TextModel.Computed('Select', '选中')
    static readonly Signal = TextModel.Computed('Signal', '信号')
    static readonly SelectAll = TextModel.Computed('SelectAll', '全选')
    // T:
    static readonly To = TextModel.Computed('To', '到')
    static readonly Tag = TextModel.Computed('Tag', '标签')
    static readonly Type = TextModel.Computed('Type', '类型')
    static readonly Theme = TextModel.Computed('Theme', '主题')
    static readonly Transfer = TextModel.Computed('Transfer', '调拨')
    static readonly TagType = TextModel.Computed('TagType', '标签类型')
    static readonly TagDetail = TextModel.Computed('TagDetail', '标签详情')
    static readonly Temperature = TextModel.Computed('Temperature', '温度')
    static readonly TransferDetail = TextModel.Computed('TransferDetail', '调拨详情')
    // U:
    static readonly Unbind = TextModel.Computed('Unbind', '解绑')
    static readonly Undone = TextModel.Computed('Undone', '未完成')
    static readonly Unknown = TextModel.Computed('Unknown', '未知')
    static readonly Unbound = TextModel.Computed('Unbound', '未绑定')
    // V:
    static readonly Vehicle = TextModel.Computed('Vehicle', '车辆')
    static readonly Version = TextModel.Computed('Version: V', '版本：V')
    static readonly VerificationCodeLogin = TextModel.Computed('Verification code login', '验证码登录')
    // Y:
    static readonly Yes = TextModel.Computed('Yes', '是')
}