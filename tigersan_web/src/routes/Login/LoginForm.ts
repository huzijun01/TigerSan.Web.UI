import { UserInfo } from '@/models'
import { useUserInfo } from '@/stores'
import {
    Verify, FormModel, FormConfig, SubmitResult, FormItemConfig, TextBoxModel, PasswordModel, FormResult,
    useRouter,
} from '@/0_tigersan_ui/tigerui'

const uname = new TextBoxModel()
uname.Width.value = "100%"
uname.Placeholder.value = "用户名/邮箱"

const pwd = new PasswordModel()
pwd.Width.value = "100%"
pwd.Placeholder.value = "密码"

const captcha = new TextBoxModel()
captcha.Placeholder.value = "验证码"

/** “用户名”项目配置 */
const configUserName: FormItemConfig = {
    _propName: 'UserName',
    PropText: '',
    IsEquired: true,
    Target: uname.Value,
    _isVerifyOk: (source) => {
        var login = source as UserInfo
        return Verify.IsNotUndefinedOrEmpty(login.UserName)
    }
}

/** “密码”项目配置 */
const configPassword: FormItemConfig = {
    _propName: 'Password',
    PropText: '',
    IsEquired: true,
    Target: pwd.Value,
    _isVerifyOk: (source) => {
        var login = source as UserInfo
        return Verify.IsNotUndefinedOrEmpty(login.Password)
    }
}

/** “验证码”项目配置 */
const configCaptcha: FormItemConfig = {
    _propName: 'Captcha',
    PropText: '',
    IsEquired: true,
    Target: captcha.Value,
    _isVerifyOk: (source) => {
        var login = source as UserInfo
        return Verify.IsNotUndefinedOrEmpty(login.Captcha)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new UserInfo()
}

/** 提交 */
const OnSubmit = (source: object) => {
    const userInfo = useUserInfo()
    const newUserInfo = source as UserInfo
    userInfo.UserName = newUserInfo.UserName
    userInfo.Password = newUserInfo.Password
    userInfo.Captcha = newUserInfo.Captcha
    useRouter().GoTo('/')

    return new SubmitResult('登录成功')
}

/** “网关”表单配置 */
let configLoginForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _onSubmit: OnSubmit,
    _itemConfigs: [
        configUserName,
        configPassword,
        configCaptcha,
    ]
}

/** “网关”表单模型 */
const loginForm = new FormModel(configLoginForm)
loginForm._isShowSuccessResult = false

export default {
    uname,
    pwd,
    captcha,
    configUserName,
    configPassword,
    configCaptcha,
    loginForm,
}