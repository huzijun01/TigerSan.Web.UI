import { TextBoxModel, PasswordModel, FormItemConfig, Verify, ActionResultCode, SubmitResult, FormResult, ObjectHelper, authorityHelper, useRouter, FormConfig, FormModel, DialogState, dialog, DialogMode, Colors, TokenHelper, loading } from '@/0_tigersan_ui/tigerui'
import { useUserInfo } from '@/stores'
import { navData } from '@/navs/navModel'
import { UserInfo, UserHelper } from '@/models'
import { axiosHelper } from '@/models/base/AxiosHelper'

// 组件模型:
const uname = new TextBoxModel()
uname.Width.value = "100%"
uname.PlaceholderCN.value = '用户名/电话/邮箱'
uname.PlaceholderEN.value = 'Username/Phone/Email'

const pwd = new PasswordModel()
pwd.Width.value = "100%"
pwd.PlaceholderCN.value = '密码'
pwd.PlaceholderEN.value = 'Password'

const captcha = new TextBoxModel()
captcha.Width.value = '100%'
captcha.PlaceholderCN.value = '验证码'
captcha.PlaceholderEN.value = 'Captcha'

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
    const userInfoForm = source as UserInfo
    // 发送“登录请求”:
    var res = await UserHelper.LoginAsync(userInfoForm.username, userInfoForm.password)
    if (res.code == ActionResultCode.Error) {
        return new SubmitResult(res.message, FormResult.Error)
    }

    if (res.data === undefined) {
        return new SubmitResult('The data is undefined!', FormResult.Error)
    }

    GoToHome(res.data as object)

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

/** 登出 */
function Logout() {
    dialog.ShowDialog(
        '确认',
        '是否退出登录？',
        undefined,
        FnLogout,
        DialogMode.YesOrNo,
        Colors.Warning)
}

async function FnLogout(state: DialogState) {
    if (state != DialogState.Yes) return

    try {
        loading.IsShow.value = true

        const userInfo = useUserInfo()

        // 发送“登出请求”:
        var res = await UserHelper.LogoutAsync(userInfo.username)
        if (res.code === ActionResultCode.Error) {
            dialog.ShowError(res.message)
            return
        }

        TokenHelper.Save()
        ObjectHelper.ShallowSet(new UserInfo(), userInfo)
        useRouter().GoTo('/')
    } finally {
        loading.IsShow.value = false
    }
}

/** Token登录 */
async function LoginByToken() {
    const token = TokenHelper.Get()
    if (!token) return

    try {
        loading.IsShow.value = true

        // 发送“登出请求”:
        var res = await UserHelper.LoginByTokenAsync(token)
        if (!res.data) {
            TokenHelper.Save()
            dialog.ShowError(res.message)
            return
        }

        GoToHome(res.data as object)
    } finally {
        loading.IsShow.value = false
    }
}

/** 进入主页 */
function GoToHome(data: object) {
    const userInfo = useUserInfo()

    // 保存“用户信息”:
    ObjectHelper.ShallowSet(data as object, userInfo)

    // 添加“权限”:
    if (userInfo.isAdmin && userInfo.isRoot) {
        authorityHelper.AddAllAuthorities()
    } else {
        authorityHelper.SetAuthorities(userInfo.authorities)
    }

    // 设置Token:
    axiosHelper.SetAuthorization(userInfo.token)
    TokenHelper.Save(userInfo.token)

    // 初始化“导航栏”:
    navData.InitBasicSettings()
    // 跳转到“主页”:
    useRouter().GoTo('Home')
}

export default {
    uname,
    pwd,
    captcha,
    configUsername,
    configPassword,
    configCaptcha,
    loginForm,
    Logout,
    LoginByToken,
}