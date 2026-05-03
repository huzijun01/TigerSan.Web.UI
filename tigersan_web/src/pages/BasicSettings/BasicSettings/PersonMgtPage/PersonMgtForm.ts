import { ref } from 'vue'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, ArrayHelper, BigintHelper, PasswordModel, SearchModel, GetSubmitResult, IdNameModel, MyActionResult } from '@/0_tigersan_ui/tigerui'
import { personMgtTable, pagination } from './PersonMgtTable'
import { companyHelper, personHelper, departmentHelper, roleHelper, PersonModel } from '@/models'

// 选择框:
/** 筛选 */
const selectCompany = companyHelper.GetIdNameSelectModel()
selectCompany._getItemsAsync = async () => await personHelper.GetBelongCompanyListAsync()
const selectDepartment = departmentHelper.GetIdNameSelectModel()
selectDepartment._getItemsAsync = async () => selectCompany.Value.value ? await personHelper.GetBelongDepartmentListAsync(selectCompany.Value.value?.id) : []
const selectRole = roleHelper.GetIdNameSelectModel()
selectRole._getItemsAsync = async () => selectDepartment.Value.value ? await personHelper.GetBelongRoleListAsync(selectDepartment.Value.value?.id) : []
/** 表单 */
const selectCompanyForm = companyHelper.GetIdNameSelectModel()
const selectDepartmentForm = departmentHelper.GetIdNameSelectModel()
selectDepartmentForm._getItemsAsync = async () => selectCompanyForm.Value.value ? await departmentHelper.SelectIdNameByCompanyAsync(selectCompanyForm.Value.value?.id) : []
const selectRoleForm = roleHelper.GetIdNameSelectModel()
selectRoleForm._getItemsAsync = async () => selectDepartmentForm.Value.value ? await roleHelper.SelectIdNameByDepartment(selectDepartmentForm.Value.value?.id) : []
// 更新:
selectCompanyForm._onChange = selectDepartmentForm.UpdateItemsAsync
selectDepartmentForm._onChange = selectRoleForm.UpdateItemsAsync

/** 搜索框 */
const searchName = new SearchModel()
searchName.PlaceholderCN.value = "用户名/昵称"
searchName.PlaceholderEN.value = "Username/Nickname"
searchName._onChange = Refresh
searchName._onSearch = Refresh

/** 密码框 */
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
const configTagId: FormItemConfig<PersonModel, string> = {
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
    _isVerifyOk: (source, isEdit) => {
        if (isEdit && source.password === '') return Verify.GetOK()
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

/** “邮箱”项目配置 */
const configMail: FormItemConfig<PersonModel, string> = {
    _propName: 'mail',
    PropText: '邮箱',
    IsEquired: false,
    Target: ref(),
    _isVerifyOk: source => Verify.IsValidEmail(source.mail)
}

/** “增”源数据获取方法 */
const AddGetSource = () => new PersonModel()

/** “人员”表单配置 */
let configPersonMgtForm: FormConfig<PersonModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        password.IsShowValue.value = false
        if (isEdit) {
            const rowData = personMgtTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return
            }

            await selectCompanyForm.UpdateItemsAsync()
            selectCompanyForm.Value.value = companyHelper.GetIdName(rowData.company)
            await selectDepartmentForm.UpdateItemsAsync()
            selectDepartmentForm.Value.value = departmentHelper.GetIdName(rowData.department)
            await selectRoleForm.UpdateItemsAsync()
            selectRoleForm.Value.value = roleHelper.GetIdName(rowData.role)
        }
    },
    _itemConfigs: [
        configCompany,
        configDepartment,
        configRole,
        configUsername,
        configTagId,
        configPassword,
        configPhone,
        configMail,
    ]
}

/** “人员”表单模型 */
const personForm = new FormModel(configPersonMgtForm)

/** 查 */
async function Refresh() {
    await companyHelper.UpdateIdNames()
    await departmentHelper.UpdateIdNames()
    await roleHelper.UpdateIdNames()
    await selectCompany.UpdateItemsAsync()
    await selectDepartment.UpdateItemsAsync()
    await selectRole.UpdateItemsAsync()

    pagination.Count.value = await personHelper.GetCount({
        company: selectCompany.Value.value?.id,
        department: selectDepartment.Value.value?.id,
        role: selectRole.Value.value?.id,
        name: searchName.Value.value,
    })
    await personHelper.GetList({
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
    personForm.Title.value = '新增人员'

    personForm._getSource = AddGetSource

    personForm._onSubmitAsync = async source => {
        const res = await personHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    personForm.Show()
}

/** 改 */
async function Edit() {
    personForm.Title.value = '修改人员'

    personForm._getSource = () => {
        const rowData = personMgtTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new PersonModel()
        }

        const data = ObjectHelper.ShallowCopy(rowData)
        data.password = ''
        return data
    }

    personForm._onSubmitAsync = async source => {
        const res = await personHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    personForm.Show(true)
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

    personHelper.Delete(model.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export const personMgtForm = {
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
    configTagId,
    configPassword,
    configPhone,
    configMail,
    personForm,
    Refresh,
    Add,
    Edit,
    Delete,
}