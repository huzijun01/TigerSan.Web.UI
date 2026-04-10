import { reactive } from 'vue'
import { useUserInfo } from '@/stores'
import { Verify, ObjectHelper, FormModel, FormConfig, FormItemConfig, PasswordModel } from '@/0_tigersan_ui/tigerui'
import { GetSubmitResult, PasswordEditModel, UserHelper } from '@/models'

const passwordEdit = reactive(new PasswordEditModel())

/** 密码框 */
const password = new PasswordModel()
const oldPassword = new PasswordModel()
const confirmPassword = new PasswordModel()

/** “原始密码”项目配置 */
const configOldPassword: FormItemConfig<PasswordEditModel, string> = {
    _propName: 'oldPassword',
    PropText: '旧密码',
    IsEquired: true,
    Target: oldPassword.Value,
    _isVerifyOk: (source, isEdit) => Verify.IsValidWeekPassword(source.oldPassword)
}

/** “新密码”项目配置 */
const configPassword: FormItemConfig<PasswordEditModel, string> = {
    _propName: 'password',
    PropText: '新密码',
    IsEquired: true,
    Target: password.Value,
    _isVerifyOk: (source, isEdit) => Verify.IsValidWeekPassword(source.password)
}

/** “确认密码”项目配置 */
const configConfirmPassword: FormItemConfig<PasswordEditModel, string> = {
    _propName: 'confirmPassword',
    PropText: '确认密码',
    IsEquired: true,
    Target: confirmPassword.Value,
    _isVerifyOk: (source, isEdit) => Verify.IsEqual(source.password, source.confirmPassword)
}

/** “增”源数据获取方法 */
const AddGetSource = () => new PasswordEditModel()

/** “修改密码”表单配置 */
let configPersonMgtForm: FormConfig<PasswordEditModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        password.IsShowValue.value = false
        oldPassword.IsShowValue.value = false
        confirmPassword.IsShowValue.value = false
    },
    _itemConfigs: [
        configPassword,
        configOldPassword,
        configConfirmPassword,
    ]
}

/** “修改密码”表单模型 */
const passwordForm = new FormModel(configPersonMgtForm)

/** 改 */
async function Edit() {
    passwordForm.Title.value = '修改用户信息'

    passwordForm._getSource = () => {
        ObjectHelper.ShallowSet(new PasswordEditModel(), passwordEdit)
        passwordEdit.id = useUserInfo().id
        return passwordEdit
    }

    passwordForm._onSubmitAsync = async source => {
        const res = await UserHelper.EditPassword(source)
        return GetSubmitResult(res, '修改成功')
    }

    passwordForm.Show(true)
}

export default {
    passwordEdit,
    password,
    oldPassword,
    confirmPassword,
    passwordForm,
    configPassword,
    configOldPassword,
    configConfirmPassword,
    Edit,
}