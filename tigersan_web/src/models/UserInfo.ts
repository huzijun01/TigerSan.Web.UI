import { StringHelper } from '@/0_tigersan_ui/tigerui'

export class UserInfo {
    UserName = ''
    Password = ''
    Captcha = ''

    Clear = () => {
        this.UserName = ''
        this.Password = ''
        this.Captcha = ''
    }
}

export function IsUserInfoVerifyOk(user: UserInfo): boolean {
    return StringHelper.IsNotEmpty(user.UserName)
        && StringHelper.IsNotEmpty(user.Password)
}