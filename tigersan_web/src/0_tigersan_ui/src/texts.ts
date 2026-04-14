import { TextModel } from "./models/Text/TextModel"

/** 文本集合 */
class Texts {
    static readonly Yes = TextModel.Computed('Yes', '是')
    static readonly No = TextModel.Computed('No', '否')
    static readonly Cancel = TextModel.Computed('Cancel', '取消')
    static readonly Count = TextModel.Computed('Count', '总数')
    static readonly To = TextModel.Computed('To', '到')
    static readonly page = TextModel.Computed('page', '页')
    static readonly Select = TextModel.Computed('Select', '选中')
    static readonly Colon = TextModel.Computed(': ', '：')
    static readonly PleaseEnter = TextModel.Computed('Please enter.', '请输入')
    static readonly PleaseSelect = TextModel.Computed('Please select.', '请选择')
    static readonly NoContent = TextModel.Computed('No Content', '无内容')
    static readonly Language = TextModel.Computed('Language', '语言')
    static readonly Theme = TextModel.Computed('Theme', '主题')
    static readonly Login = TextModel.Computed('Login', '登录')
    static readonly VerificationCodeLogin = TextModel.Computed('Verification code login', '验证码登录')
    static readonly BasicSettings = TextModel.Computed('Basic Settings', '基础设置')
    static readonly Help = TextModel.Computed('Help', '帮助')
    static readonly Progress = TextModel.Computed('Progress', '进度')
    static readonly All = TextModel.Computed('All', '全部')
    static readonly Online = TextModel.Computed('Online', '在线')
    static readonly Offline = TextModel.Computed('Offline', '离线')
    static readonly Enable = TextModel.Computed('Enable', '启用')
    static readonly Disable = TextModel.Computed('Disable', '禁用')
    static readonly Version = TextModel.Computed('Version: V', '版本：V')
    static readonly IsReadonly = TextModel.Computed('IsReadonly: ', '是否只读：')
    static readonly ChangePassword = TextModel.Computed('Change password ', '修改密码')
    static readonly Stolid = TextModel.Computed('Stolid', '滞留')
    static readonly Inbound = TextModel.Computed('Inbound', '入库')
    static readonly Outbound = TextModel.Computed('Outbound', '出库')
    static readonly InTransit = TextModel.Computed('InTransit', '在途')
    static readonly InTransitTimeout = TextModel.Computed('InTransitTimeout', '在途超时')
    static readonly Unknown = TextModel.Computed('Unknown', '未知')
}

export {
    Texts,
}