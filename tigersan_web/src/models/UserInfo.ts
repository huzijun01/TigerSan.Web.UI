import { ObjectHelper, StringHelper } from '@/0_tigersan_ui/tigerui'
import { IdNameModel } from '@/models'
import { AuthorityModel } from './AuthorityModel'
import { AxiosHelper } from '@/helpers'

export class UserInfo {
    // 基础:
    username = ''
    nickname = ''
    password = ''
    avatar?: string
    phone?: string
    mail?: string
    // 附加:
    isAdmin = false
    isRoot = false
    captcha = ''
    company = new IdNameModel()
    department = new IdNameModel()
    role = new IdNameModel()
    authorities: AuthorityModel[] = []

    constructor(
        uname: string = '',
        pwd: string = '',
        captcha: string = '') {
        this.username = uname
        this.password = pwd
        this.captcha = captcha
    }

    Clear = () => {
        ObjectHelper.ShallowSet(new UserInfo(), this)
    }
}

export class UserHelper {
    static _action = 'User'

    /** 筛选“总数” */
    static readonly LoginAsync = async (search: string, password: string) => await AxiosHelper.Get(`${this._action}/Login`, [{ key: 'search', value: search }, { key: 'password', value: password }])

    static IsUserInfoVerifyOk(user: UserInfo): boolean {
        return StringHelper.IsNotEmpty(user.username)
            && StringHelper.IsNotEmpty(user.nickname)
    }
}