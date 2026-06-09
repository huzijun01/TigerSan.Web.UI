import { ref } from 'vue'
import { TextBoxModel, PasswordModel, FormItemConfig, Verify, ActionResultCode, SubmitResult, FormResult, ObjectHelper, authorityHelper, useRouter, FormConfig, FormModel, DialogState, DialogHelper, DialogMode, Colors, TokenHelper, loading, Texts } from '@/0_tigersan_ui/tigerui'
import { useUserInfo } from '@/stores'
import { navData } from '@/navs/navModel'
import { UserInfo, UserHelper } from '@/models'
import { axiosHelper } from '@/models/base/AxiosHelper'

export class LoginFormModel {
    //#region 【Fields】
    // 组件模型:
    readonly uname = new TextBoxModel()

    readonly pwd = new PasswordModel()

    readonly captcha = new TextBoxModel()

    // 配置:
    /** “用户名”项目配置 */
    readonly configUsername: FormItemConfig<UserInfo, string> = {
        _propName: 'username',
        PropText: '',
        IsEquired: true,
        Target: this.uname.Value,
        _isVerifyOk: source => {
            return Verify.IsNotUndefinedOrEmpty(source.username)
        }
    }

    /** “密码”项目配置 */
    readonly configPassword: FormItemConfig<UserInfo, string> = {
        _propName: 'password',
        PropText: '',
        IsEquired: true,
        Target: this.pwd.Value,
        _isVerifyOk: source => {
            return Verify.IsNotUndefinedOrEmpty(source.password)
        }
    }

    /** “验证码”项目配置 */
    readonly configCaptcha: FormItemConfig<UserInfo, string> = {
        _propName: 'captcha',
        PropText: '',
        IsEquired: true,
        Target: this.captcha.Value,
        _isVerifyOk: source => {
            return Verify.IsNotUndefinedOrEmpty(source.captcha)
        }
    }

    /** “增”源数据获取方法 */
    readonly GetSource = () => {
        if (false) {
            return new UserInfo()
        } else {
            return new UserInfo('admin', 'admin123', '')
        }
    }

    /** 提交 */
    readonly OnSubmitAsync = async (source: object) => {
        const userInfoForm = source as UserInfo
        // 发送“登录请求”:
        var res = await UserHelper.LoginAsync(userInfoForm.captcha, userInfoForm.username, userInfoForm.password)
        if (res.code === ActionResultCode.InvalidCaptcha) {
            this.UpdateCaptcha()
            this.configCaptcha.ItemModel?.SetError(Texts.IncorrectCaptcha.value)
            return new SubmitResult()
        }
        else if (res.code != ActionResultCode.Success) {
            return new SubmitResult(res.message, FormResult.Error)
        }

        if (res.data === undefined) {
            return new SubmitResult('The data is undefined!', FormResult.Error)
        }

        this.GoToHome(res.data as object)

        return new SubmitResult('登录成功')
    }

    /** “登录”表单配置 */
    readonly configLoginForm: FormConfig<UserInfo> = {
        CancelText: '取消',
        SubmitText: '确定',
        _getSource: this.GetSource,
        _onSubmitAsync: this.OnSubmitAsync,
        _itemConfigs: [
            this.configUsername,
            this.configPassword,
            this.configCaptcha,
        ]
    }

    /** “登录”表单模型 */
    readonly form = new FormModel(this.configLoginForm)
    //#endregion 【Fields】

    //#region 【Properties】
    readonly CaptchaUrl = ref<string | undefined>()
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor() {
        this.form._isShowSuccessResult = false
        this.uname.Width.value = "100%"
        this.uname.PlaceholderCN.value = '用户名/电话/邮箱'
        this.uname.PlaceholderEN.value = 'Username/Phone/Email'
        this.pwd.Width.value = "100%"
        this.pwd.PlaceholderCN.value = '密码'
        this.pwd.PlaceholderEN.value = 'Password'
        this.captcha.Width.value = '100%'
        this.captcha.PlaceholderCN.value = '验证码'
        this.captcha.PlaceholderEN.value = 'Captcha'
        this.captcha._onEnter = () => this.OnSubmitAsync(this.form._source)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 更新“验证码” */
    readonly UpdateCaptcha = async () => {
        try {
            loading.IsShow.value = true

            const res = await UserHelper.GetCaptcha()
            const bytes = res.data as string | undefined
            if (!bytes) {
                DialogHelper.ShowError(res.message)
                return
            }

            if (this.CaptchaUrl.value) {
                URL.revokeObjectURL(this.CaptchaUrl.value)
            }
            this.CaptchaUrl.value = `data:image/png;base64,${bytes}`
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 登出 */
    readonly Logout = () => {
        DialogHelper.ShowDialog(
            '确认',
            '是否退出登录？',
            undefined,
            this.FnLogout,
            DialogMode.YesOrNo,
            Colors.Warning)
    }

    readonly FnLogout = async (state: DialogState) => {
        if (state != DialogState.Yes) return

        try {
            loading.IsShow.value = true

            const userInfo = useUserInfo()

            // 发送“登出请求”:
            var res = await UserHelper.LogoutAsync(userInfo.username)
            if (res.code != ActionResultCode.Success) {
                DialogHelper.ShowError(res.message)
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
    readonly LoginByToken = async () => {
        const token = TokenHelper.Get()
        if (!token) return

        try {
            loading.IsShow.value = true

            // 发送“登出请求”:
            var res = await UserHelper.LoginByTokenAsync(token)
            if (!res.data) {
                TokenHelper.Save()
                DialogHelper.ShowError(res.message)
                return
            }

            this.GoToHome(res.data as object)
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 进入主页 */
    readonly GoToHome = (data: object) => {
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
    //#endregion 【Functions】
}

export const loginFormModel = new LoginFormModel()