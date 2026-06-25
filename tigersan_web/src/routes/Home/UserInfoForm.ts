import { reactive, ref } from 'vue'
import { Verify, ObjectHelper, FormModel, FormConfig, FormItemConfig, PasswordModel, Texts } from '@/0_tigersan_ui/tigerui'
import { UserInfo } from '@/models'
import { useUserInfo } from '@/stores'

export class UserInfoForm {
    isPasswordChanged = false
    readonly person = reactive(new UserInfo())
    /** 密码框 */
    readonly password = new PasswordModel()

    /** “公司”项目配置 */
    readonly configCompany: FormItemConfig<UserInfo, string> = {
        _propName: 'companyIdName',
        PropTextEN: 'Company',
        PropTextCH: '公司',
        IsEquired: false,
        Target: ref(),
        _getValue: source => source.companyIdName.name,
        _setValue: (source, propName, value) => source.companyIdName.name = value ?? ''
    }

    /** “部门”项目配置 */
    readonly configDepartment: FormItemConfig<UserInfo, string> = {
        _propName: 'departmentIdName',
        PropTextEN: 'Department',
        PropTextCH: '部门',
        IsEquired: false,
        Target: ref(),
        _getValue: source => source.departmentIdName.name,
        _setValue: (source, propName, value) => source.departmentIdName.name = value ?? ''
    }

    /** “角色”项目配置 */
    readonly configRole: FormItemConfig<UserInfo, string> = {
        _propName: 'roleIdName',
        PropTextEN: 'Role',
        PropTextCH: '角色',
        IsEquired: true,
        Target: ref(),
        _getValue: source => source.roleIdName.name,
        _setValue: (source, propName, value) => source.roleIdName.name = value ?? ''
    }

    /** “用户名”项目配置 */
    readonly configUsername: FormItemConfig<UserInfo, string> = {
        _propName: 'username',
        PropTextEN: 'Username',
        PropTextCH: '用户名',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsValidUsername(source.username)
    }

    /** “昵称”项目配置 */
    readonly configTagId: FormItemConfig<UserInfo, string> = {
        _propName: 'nickname',
        PropTextEN: 'Nickname',
        PropTextCH: '昵称',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsValidNickname(source.nickname)
    }

    /** “密码”项目配置 */
    readonly configPassword: FormItemConfig<UserInfo, string> = {
        _propName: 'password',
        PropTextEN: 'Password',
        PropTextCH: '密码',
        IsEquired: true,
        Target: this.password.Value,
        _onChange: () => this.isPasswordChanged = true,
        _isVerifyOk: (source, isEdit) => {
            if (isEdit && !this.isPasswordChanged) return Verify.GetOK()
            return Verify.IsValidWeekPassword(source.password)
        }
    }

    /** “电话”项目配置 */
    readonly configPhone: FormItemConfig<UserInfo, string> = {
        _propName: 'phone',
        PropTextEN: 'Phone',
        PropTextCH: '电话',
        IsEquired: false,
        Target: ref(),
        _isVerifyOk: source => Verify.IsValidPhoneNumber(source.phone)
    }

    /** “邮箱”项目配置 */
    readonly configMail: FormItemConfig<UserInfo, string> = {
        _propName: 'mail',
        PropTextEN: 'Mail',
        PropTextCH: '邮箱',
        IsEquired: false,
        Target: ref(),
        _isVerifyOk: source => Verify.IsValidEmail(source.mail)
    }

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => new UserInfo()

    /** “用户信息”表单配置 */
    readonly configPersonMgtForm: FormConfig<UserInfo> = {
        CancelText: Texts.Cancel.value,
        SubmitText: Texts.Ok.value,
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
            this.isPasswordChanged = false
            this.password.IsShowValue.value = false
        },
        _itemConfigs: [
            this.configCompany,
            this.configDepartment,
            this.configRole,
            this.configUsername,
            this.configTagId,
            this.configPassword,
            this.configPhone,
            this.configMail,
        ]
    }

    /** “用户信息”表单模型 */
    readonly userInfoForm = new FormModel(this.configPersonMgtForm)

    //#region 【Ctor】
    constructor() {
        this.password.Width.value = '108px'
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 改 */
    readonly Edit = async () => {
        this.userInfoForm.Title.value = '修改用户信息'

        this.userInfoForm._getSource = () => {
            const userInfo = useUserInfo()
            ObjectHelper.ShallowSet(userInfo, this.person)
            return this.person
        }

        // userInfoForm._onSubmitAsync = async source => {
        //     const res = await userInfoHelper.Edit(source)
        //     return GetSubmitResult(res, '修改成功')
        // }

        this.userInfoForm.Show(true)
    }
    //#endregion 【Functions】
}