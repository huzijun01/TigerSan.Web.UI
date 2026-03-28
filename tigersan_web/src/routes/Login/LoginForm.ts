import { useUserInfo } from '@/stores'
import { ActionResultCode, UserHelper, UserInfo } from '@/models'
import { Verify, FormModel, FormConfig, SubmitResult, FormItemConfig, TextBoxModel, PasswordModel, useRouter, ObjectHelper, FormResult } from '@/0_tigersan_ui/tigerui'

// 组件模型:
const uname = new TextBoxModel()
uname.Width.value = "100%"
uname.Placeholder.value = "用户名/电话/邮箱"

const pwd = new PasswordModel()
pwd.Width.value = "100%"
pwd.Placeholder.value = "密码"

const captcha = new TextBoxModel()
captcha.Placeholder.value = "验证码"

// 配置:
/** “用户名”项目配置 */
const configUsername: FormItemConfig<UserInfo, string> = {
    _propName: 'username',
    PropText: '',
    IsEquired: true,
    Target: uname.Value,
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.username)
    }
}

/** “密码”项目配置 */
const configPassword: FormItemConfig<UserInfo, string> = {
    _propName: 'password',
    PropText: '',
    IsEquired: true,
    Target: pwd.Value,
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.password)
    }
}

/** “验证码”项目配置 */
const configCaptcha: FormItemConfig<UserInfo, string> = {
    _propName: 'Captcha',
    PropText: '',
    IsEquired: true,
    Target: captcha.Value,
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.captcha)
    }
}

/** “增”源数据获取方法 */
const GetSource = () => {
    return new UserInfo('admin', 'admin', '1234')
}

/** 提交 */
const OnSubmitAsync = async (source: object) => {
    const userInfo = useUserInfo()
    const userInfoForm = source as UserInfo
    var res = await UserHelper.LoginAsync(userInfoForm.username, userInfoForm.password)
    if (res.code == ActionResultCode.Error) {
        return new SubmitResult(res.message, FormResult.Error)
    }

    if (res.data === undefined) {
        return new SubmitResult('The data is undefined!', FormResult.Error)
    }

    ObjectHelper.ShallowSet(res.data as object, userInfo)
    useRouter().GoTo('Home')

    return new SubmitResult('登录成功')
}

/** “登录”表单配置 */
let configLoginForm: FormConfig<UserInfo> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: GetSource,
    _onSubmitAsync: OnSubmitAsync,
    _itemConfigs: [
        configUsername,
        configPassword,
        configCaptcha,
    ]
}

/** “登录”表单模型 */
const loginForm = new FormModel(configLoginForm)
loginForm._isShowSuccessResult = false

export default {
    uname,
    pwd,
    captcha,
    configUsername,
    configPassword,
    configCaptcha,
    loginForm,
}