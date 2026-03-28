import { reactive, ref } from 'vue'
import { useUserInfo } from '@/stores'
import { UserInfo } from '@/models'
import { Verify, ObjectHelper, FormModel, FormConfig, FormItemConfig, PasswordModel } from '@/0_tigersan_ui/tigerui'

const person = reactive(new UserInfo())

/** 密码框 */
let isPasswordChanged = false
const password = new PasswordModel()
password.Width.value = '108px'

/** “公司”项目配置 */
const configCompany: FormItemConfig<UserInfo, string> = {
    _propName: 'company',
    PropText: '公司',
    IsEquired: false,
    Target: ref(),
    _getValue: source => source.company.name,
    _setValue: (source, propName, value) => source.company.name = value ?? ''
}

/** “部门”项目配置 */
const configDepartment: FormItemConfig<UserInfo, string> = {
    _propName: 'department',
    PropText: '部门',
    IsEquired: false,
    Target: ref(),
    _getValue: source => source.department.name,
    _setValue: (source, propName, value) => source.department.name = value ?? ''
}

/** “角色”项目配置 */
const configRole: FormItemConfig<UserInfo, string> = {
    _propName: 'role',
    PropText: '角色',
    IsEquired: true,
    Target: ref(),
    _getValue: source => source.role.name,
    _setValue: (source, propName, value) => source.role.name = value ?? ''
}

/** “用户名”项目配置 */
const configUsername: FormItemConfig<UserInfo, string> = {
    _propName: 'username',
    PropText: '用户名',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsValidUsername(source.username)
}

/** “昵称”项目配置 */
const configNickname: FormItemConfig<UserInfo, string> = {
    _propName: 'nickname',
    PropText: '昵称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsValidNickname(source.nickname)
}

/** “密码”项目配置 */
const configPassword: FormItemConfig<UserInfo, string> = {
    _propName: 'password',
    PropText: '密码',
    IsEquired: true,
    Target: password.Value,
    _onChange: () => isPasswordChanged = true,
    _isVerifyOk: (source, isEdit) => {
        if (isEdit && !isPasswordChanged) return Verify.GetOK()
        return Verify.IsValidWeekPassword(source.password)
    }
}

/** “电话”项目配置 */
const configPhone: FormItemConfig<UserInfo, string> = {
    _propName: 'phone',
    PropText: '电话',
    IsEquired: false,
    Target: ref(),
    _isVerifyOk: source => Verify.IsValidPhoneNumber(source.phone)
}

/** “电话”项目配置 */
const configMail: FormItemConfig<UserInfo, string> = {
    _propName: 'mail',
    PropText: '邮箱',
    IsEquired: false,
    Target: ref(),
    _isVerifyOk: source => Verify.IsValidEmail(source.mail)
}

/** “增”源数据获取方法 */
const AddGetSource = () => new UserInfo()

/** “人员管理”表单配置 */
let configPersonMgtForm: FormConfig<UserInfo> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        isPasswordChanged = false
        password.IsShowValue.value = false
    },
    _itemConfigs: [
        configCompany,
        configDepartment,
        configRole,
        configUsername,
        configNickname,
        configPassword,
        configPhone,
        configMail,
    ]
}

/** “人员管理”表单模型 */
const personMgtForm = new FormModel(configPersonMgtForm)

/** 改 */
async function Edit() {
    personMgtForm.Title.value = '修改人员'

    personMgtForm._getSource = () => {
        const userInfo = useUserInfo()
        ObjectHelper.ShallowSet(userInfo, person)

        console.log(person)

        return person
    }

    // personMgtForm._onSubmitAsync = async source => {
    //     const res = await personMgtHelper.Edit(source)
    //     return GetSubmitResult(res, '修改成功')
    // }

    personMgtForm.Show(true)
}

export default {
    person,
    password,
    configCompany,
    configDepartment,
    configRole,
    configUsername,
    configNickname,
    configPassword,
    configPhone,
    configMail,
    personMgtForm,
    Edit,
}