import { ref } from 'vue'
import { personMgtTable, pagination } from './PersonMgtTable'
import { GetSubmitResult, MyActionResult, IdNameModel, companyMgtHelper, departmentMgtHelper, personMgtHelper, roleMgtHelper, PersonModel } from '@/models'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, ArrayHelper, BigintHelper, PasswordModel, SearchModel } from '@/0_tigersan_ui/tigerui'

// 选择框:
/** 筛选 */
const selectCompany = companyMgtHelper.GetSelectModel()
selectCompany._getItemsAsync = async () => await personMgtHelper.GetBelongCompanyListAsync()
const selectDepartment = departmentMgtHelper.GetSelectModel()
selectDepartment._getItemsAsync = async () => selectCompany.Value.value ? await personMgtHelper.GetBelongDepartmentListAsync(selectCompany.Value.value?.id) : []
const selectRole = roleMgtHelper.GetSelectModel()
selectRole._getItemsAsync = async () => selectDepartment.Value.value ? await personMgtHelper.GetBelongRoleListAsync(selectDepartment.Value.value?.id) : []
/** 表单 */
const selectCompanyForm = companyMgtHelper.GetSelectModel()
const selectDepartmentForm = departmentMgtHelper.GetSelectModel()
selectDepartmentForm._getItemsAsync = async () => selectCompanyForm.Value.value ? await departmentMgtHelper.SelectIdNameByCompanyAsync(selectCompanyForm.Value.value?.id) : []
const selectRoleForm = roleMgtHelper.GetSelectModel()
selectRoleForm._getItemsAsync = async () => selectDepartmentForm.Value.value ? await roleMgtHelper.SelectIdNameByDepartment(selectDepartmentForm.Value.value?.id) : []
// 更新:
selectCompanyForm._onChange = selectDepartmentForm.UpdateItemsAsync
selectDepartmentForm._onChange = selectRoleForm.UpdateItemsAsync

/** 搜索框 */
const searchName = new SearchModel()
searchName.Placeholder.value = "输入用户名或昵称"
searchName._onChange = Refresh
searchName._onSearch = Refresh

/** 密码框 */
let isPasswordChanged = false
const password = new PasswordModel()
password.Width.value = '108px'

/** “公司”项目配置 */
const configCompany: FormItemConfig<PersonModel, IdNameModel> = {
    _propName: 'company',
    PropText: '公司',
    IsEquired: false,
    Target: ref(),
    _getValue: source => selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
    _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
    // _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, '不可为空')
}

/** “部门”项目配置 */
const configDepartment: FormItemConfig<PersonModel, IdNameModel> = {
    _propName: 'department',
    PropText: '部门',
    IsEquired: false,
    Target: ref(),
    _getValue: source => selectDepartmentForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.department)),
    _setValue: (source, propName, value) => source.department = value && value.id != undefined ? value.id : 0n,
    // _isVerifyOk: source => Verify.IsBigintGreaterThan(source.department, 0n, '不可为空')
}

/** “角色”项目配置 */
const configRole: FormItemConfig<PersonModel, IdNameModel> = {
    _propName: 'role',
    PropText: '角色',
    IsEquired: true,
    Target: selectRoleForm.Value,
    _getValue: source => selectRoleForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.role)),
    _setValue: (source, propName, value) => source.role = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.role, 0n, '不可为空')
}

/** “用户名”项目配置 */
const configUsername: FormItemConfig<PersonModel, string> = {
    _propName: 'username',
    PropText: '用户名',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsValidUsername(source.username)
}

/** “昵称”项目配置 */
const configNickname: FormItemConfig<PersonModel, string> = {
    _propName: 'nickname',
    PropText: '昵称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsValidNickname(source.nickname)
}

/** “密码”项目配置 */
const configPassword: FormItemConfig<PersonModel, string> = {
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
const configPhone: FormItemConfig<PersonModel, string> = {
    _propName: 'phone',
    PropText: '电话',
    IsEquired: false,
    Target: ref(),
    _isVerifyOk: source => Verify.IsValidPhoneNumber(source.phone)
}

/** “电话”项目配置 */
const configMail: FormItemConfig<PersonModel, string> = {
    _propName: 'mail',
    PropText: '邮箱',
    IsEquired: false,
    Target: ref(),
    _isVerifyOk: source => Verify.IsValidEmail(source.mail)
}

/** “增”源数据获取方法 */
const AddGetSource = () => new PersonModel()

/** “人员管理”表单配置 */
let configPersonMgtForm: FormConfig<PersonModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        isPasswordChanged = false
        password.IsShowValue.value = false
        if (isEdit) {
            const rowData = personMgtTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return
            }

            await selectCompanyForm.UpdateItemsAsync()
            selectCompanyForm.Value.value = companyMgtHelper.GetIdName(rowData.company)
            await selectDepartmentForm.UpdateItemsAsync()
            selectDepartmentForm.Value.value = departmentMgtHelper.GetIdName(rowData.department)
            await selectRoleForm.UpdateItemsAsync()
            selectRoleForm.Value.value = roleMgtHelper.GetIdName(rowData.role)
        }
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

/** 查 */
async function Refresh() {
    await companyMgtHelper.UpdateIdNames()
    await departmentMgtHelper.UpdateIdNames()
    await roleMgtHelper.UpdateIdNames()
    await selectCompany.UpdateItemsAsync()
    await selectDepartment.UpdateItemsAsync()
    await selectRole.UpdateItemsAsync()

    pagination.Count.value = await personMgtHelper.GetCountAsync({
        company: selectCompany.Value.value?.id,
        department: selectDepartment.Value.value?.id,
        role: selectRole.Value.value?.id,
        name: searchName.Value.value,
    })
    await personMgtHelper.GetListAsync({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
        company: selectCompany.Value.value?.id,
        department: selectDepartment.Value.value?.id,
        role: selectRole.Value.value?.id,
        name: searchName.Value.value,
    }).then(arr => {
        ArrayHelper.Set(personMgtTable.RowDatas, arr)
    })
}

pagination._onChange = Refresh
selectCompany._onChange = Refresh
selectDepartment._onChange = Refresh
selectRole._onChange = Refresh

/** 增 */
async function Add() {
    personMgtForm.Title.value = '新增人员'

    personMgtForm._getSource = AddGetSource

    personMgtForm._onSubmitAsync = async source => {
        const res = await personMgtHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    personMgtForm.Show()
}

/** 改 */
async function Edit() {
    personMgtForm.Title.value = '修改人员'

    personMgtForm._getSource = () => {
        const rowData = personMgtTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new PersonModel()
        }

        const data = ObjectHelper.ShallowCopy(rowData)
        data.password = ''
        return data
    }

    personMgtForm._onSubmitAsync = async source => {
        const res = await personMgtHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    personMgtForm.Show(true)
}

/** 删 */
function Delete() {
    dialog.ShowDialog(
        '确认',
        '是否确定删除？',
        undefined,
        DeleteRowData,
        DialogMode.YesOrNo,
        Colors.Warning)
}

function DeleteRowData(state: DialogState) {
    if (state != DialogState.Yes) return

    const model = personMgtTable.SelectedRowDatas.value[0]
    if (!model) {
        console.warn('The model is undefined!')
        return {}
    }

    personMgtHelper.Delete(model.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export default {
    password,
    searchName,
    selectCompany,
    selectDepartment,
    selectRole,
    selectCompanyForm,
    selectDepartmentForm,
    selectRoleForm,
    configCompany,
    configDepartment,
    configRole,
    configUsername,
    configNickname,
    configPassword,
    configPhone,
    configMail,
    personMgtForm,
    Refresh,
    Add,
    Edit,
    Delete,
}