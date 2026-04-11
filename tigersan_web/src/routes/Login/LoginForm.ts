import { TextBoxModel, PasswordModel, FormItemConfig, Verify, ActionResultCode, SubmitResult, FormResult, ObjectHelper, authorityHelper, useRouter, FormConfig, FormModel } from '@/0_tigersan_ui/tigerui'
import { useUserInfo } from '@/stores'
import { navData } from '@/navs/navModel'
import { UserInfo, UserHelper } from '@/models'

// 组件模型:
const uname = new TextBoxModel()
uname.Width.value = "100%"
uname.PlaceholderCN.value = "用户名/电话/邮箱"

const pwd = new PasswordModel()
pwd.Width.value = "100%"
pwd.PlaceholderCN.value = "密码"

const captcha = new TextBoxModel()
captcha.PlaceholderCN.value = "验证码"

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
    _propName: 'captcha',
    PropText: '',
    IsEquired: true,
    Target: captcha.Value,
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.captcha)
    }
}

/** “增”源数据获取方法 */
const GetSource = () => {
    return new UserInfo('admin', 'admin123', '1234')
}

/** 提交 */
const OnSubmitAsync = async (source: object) => {
    const userInfo = useUserInfo()
    const userInfoForm = source as UserInfo
    // 发送“登录请求”:
    var res = await UserHelper.LoginAsync(userInfoForm.username, userInfoForm.password)
    if (res.code == ActionResultCode.Error) {
        return new SubmitResult(res.message, FormResult.Error)
    }

    if (res.data === undefined) {
        return new SubmitResult('The data is undefined!', FormResult.Error)
    }

    // 保存“用户信息”:
    ObjectHelper.ShallowSet(res.data as object, userInfo)

    // 添加“权限”:
    if (userInfo.isAdmin && userInfo.isRoot) {
        authorityHelper.AddAllAuthorities()
    } else {
        authorityHelper.SetAuthorities(userInfo.authorities)
    }

    // 初始化“导航栏”:
    navData.InitBasicSettings()
    // 跳转到“主页”:
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