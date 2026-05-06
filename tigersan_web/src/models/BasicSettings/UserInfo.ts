import { IdNameModel, AuthorityModel, ObjectHelper, AxiosHelper, StringHelper, IdModel } from "@/0_tigersan_ui/tigerui"
import { PersonModel } from "./PersonModel"

export class UserInfo extends PersonModel {
    isRoot = false
    captcha = ''
    companyIdName = new IdNameModel()
    departmentIdName = new IdNameModel()
    roleIdName = new IdNameModel()
    authorities: AuthorityModel[] = []
    token?: string

    constructor(
        uname: string = '',
        pwd: string = '',
        captcha: string = '') {
        super()
        this.username = uname
        this.password = pwd
        this.captcha = captcha
    }

    Clear = () => {
        ObjectHelper.ShallowSet(new UserInfo(), this)
    }
}

export class PasswordEditModel extends IdModel {
    password = ''
    oldPassword = ''
    confirmPassword = ''
}

export class UserHelper {
    static _action = 'User'

    /** 修改“密码” */
    static readonly EditPassword = async (edit: PasswordEditModel) => await AxiosHelper.Put(`${this._action}/Password`, edit)
    /** 登录 */
    static readonly LoginAsync = async (search: string, password: string) => await AxiosHelper.Get(`${this._action}/Login`, [{ key: 'search', value: search }, { key: 'password', value: password }])
    /** Token登录 */
    static readonly LoginByTokenAsync = async (token: string) => await AxiosHelper.Get(`${this._action}/LoginByToken`, [{ key: 'token', value: token }])
    /** 登出 */
    static readonly LogoutAsync = async (username: string) => await AxiosHelper.Get(`${this._action}/Logout`, [{ key: 'username', value: username }])

    static IsUserInfoVerifyOk(user: UserInfo): boolean {
        return StringHelper.IsNotEmpty(user.username)
            && StringHelper.IsNotEmpty(user.nickname)
    }
}