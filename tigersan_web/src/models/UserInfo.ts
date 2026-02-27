import { StringHelper } from '@/0_tigersan_ui/tigerui'

class UserInfo {
    UserName = ''
    Password = ''
    Captcha = ''

    constructor(
        uname: string = '',
        pwd: string = '',
        captcha: string = '') {
        this.UserName = uname
        this.Password = pwd
        this.Captcha = captcha
    }

    Clear = () => {
        this.UserName = ''
        this.Password = ''
        this.Captcha = ''
    }
}

function IsUserInfoVerifyOk(user: UserInfo): boolean {
    return StringHelper.IsNotEmpty(user.UserName)
        && StringHelper.IsNotEmpty(user.Password)
}

export {
    UserInfo,
    IsUserInfoVerifyOk,
}