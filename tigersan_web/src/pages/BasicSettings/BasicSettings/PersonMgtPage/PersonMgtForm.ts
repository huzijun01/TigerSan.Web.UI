import { ref } from 'vue'
import { Colors, DialogHelper, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, ArrayHelper, BigintHelper, PasswordModel, SearchModel, GetSubmitResult, IdNameModel, MyActionResult, loading, PaginationModel, Texts } from '@/0_tigersan_ui/tigerui'
import { personMgtTable } from './PersonMgtTable'
import { companyHelper, personHelper, departmentHelper, roleHelper, PersonModel } from '@/models'


export class PersonMgtForm {
    //#region 【Fields】
    // 选择框:
    /** 筛选 */
    readonly selectCompany = companyHelper.GetIdNameSelectModel()
    readonly selectDepartment = departmentHelper.GetIdNameSelectModel()
    readonly selectRole = roleHelper.GetIdNameSelectModel()
    /** 表单 */
    readonly selectCompanyForm = companyHelper.GetIdNameSelectModel()
    readonly selectDepartmentForm = departmentHelper.GetIdNameSelectModel()
    readonly selectRoleForm = roleHelper.GetIdNameSelectModel()
    /** 搜索框 */
    readonly searchName = new SearchModel()
    /** 密码框 */
    readonly password = new PasswordModel()
    /** 分页器 */
    readonly pagination = new PaginationModel()

    /** “公司”项目配置 */
    readonly configCompany: FormItemConfig<PersonModel, IdNameModel> = {
        _propName: 'company',
        PropTextEN: 'Company',
        PropTextCH: '公司',
        IsEquired: false,
        Target: ref(),
        _getValue: source => this.selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
        _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
        // _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, Texts.CannotBeEmpty.value)
    }

    /** “部门”项目配置 */
    readonly configDepartment: FormItemConfig<PersonModel, IdNameModel> = {
        _propName: 'department',
        PropTextEN: 'Department',
        PropTextCH: '部门',
        IsEquired: false,
        Target: ref(),
        _getValue: source => this.selectDepartmentForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.department)),
        _setValue: (source, propName, value) => source.department = value && value.id != undefined ? value.id : 0n,
        // _isVerifyOk: source => Verify.IsBigintGreaterThan(source.department, 0n, Texts.CannotBeEmpty.value)
    }

    /** “角色”项目配置 */
    readonly configRole: FormItemConfig<PersonModel, IdNameModel> = {
        _propName: 'role',
        PropTextEN: 'Role',
        PropTextCH: '角色',
        IsEquired: true,
        Target: this.selectRoleForm.Value,
        _getValue: source => this.selectRoleForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.role)),
        _setValue: (source, propName, value) => source.role = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.role, 0n, Texts.CannotBeEmpty.value)
    }

    /** “用户名”项目配置 */
    readonly configUsername: FormItemConfig<PersonModel, string> = {
        _propName: 'username',
        PropTextEN: 'Username',
        PropTextCH: '用户名',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsValidUsername(source.username)
    }

    /** “昵称”项目配置 */
    readonly configTagId: FormItemConfig<PersonModel, string> = {
        _propName: 'nickname',
        PropTextEN: 'Nickname',
        PropTextCH: '昵称',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsValidNickname(source.nickname)
    }

    /** “密码”项目配置 */
    readonly configPassword: FormItemConfig<PersonModel, string> = {
        _propName: 'password',
        PropTextEN: 'Password',
        PropTextCH: '密码',
        IsEquired: true,
        Target: this.password.Value,
        _isVerifyOk: (source, isEdit) => {
            if (isEdit && source.password === '') return Verify.GetOK()
            return Verify.IsValidWeekPassword(source.password)
        }
    }

    /** “电话”项目配置 */
    readonly configPhone: FormItemConfig<PersonModel, string> = {
        _propName: 'phone',
        PropTextEN: 'Phone',
        PropTextCH: '电话',
        IsEquired: false,
        Target: ref(),
        _isVerifyOk: source => Verify.IsValidPhoneNumber(source.phone)
    }

    /** “邮箱”项目配置 */
    readonly configMail: FormItemConfig<PersonModel, string> = {
        _propName: 'mail',
        PropTextEN: 'Mail',
        PropTextCH: '邮箱',
        IsEquired: false,
        Target: ref(),
        _isVerifyOk: source => Verify.IsValidEmail(source.mail)
    }

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => new PersonModel()

    /** “人员”表单配置 */
    readonly configPersonMgtForm: FormConfig<PersonModel> = {
        CancelText: Texts.Cancel.value,
        SubmitText: Texts.Ok.value,
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
            this.password.IsShowValue.value = false
            if (isEdit) {
                const rowData = personMgtTable.SelectedRowDatas.value[0]
                if (!rowData) {
                    console.warn('The rowData is undefined!')
                    return
                }

                await this.selectCompanyForm.UpdateItemsAsync()
                this.selectCompanyForm.Value.value = companyHelper.GetIdName(rowData.company)
                await this.selectDepartmentForm.UpdateItemsAsync()
                this.selectDepartmentForm.Value.value = departmentHelper.GetIdName(rowData.department)
                await this.selectRoleForm.UpdateItemsAsync()
                this.selectRoleForm.Value.value = roleHelper.GetIdName(rowData.role)
            }
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

    /** “人员”表单模型 */
    readonly personForm = new FormModel(this.configPersonMgtForm)
    //#endregion 【Fields】

    //#region 【Ctor】
    constructor() {
        this.selectCompany._getItemsAsync = async () => await personHelper.GetBelongCompanyListAsync()
        this.selectDepartment._getItemsAsync = async () => await personHelper.GetBelongDepartmentListAsync(this.selectCompany.Value.value?.id)
        this.selectRole._getItemsAsync = async () => await personHelper.GetBelongRoleListAsync(this.selectDepartment.Value.value?.id)
        this.selectDepartmentForm._getItemsAsync = async () => await departmentHelper.SelectIdNameByCompanyAsync(this.selectCompanyForm.Value.value?.id)
        this.selectRoleForm._getItemsAsync = async () => await roleHelper.SelectIdNameByDepartment(this.selectDepartmentForm.Value.value?.id)
        // 更新:
        this.selectCompanyForm._onChange = this.selectDepartmentForm.UpdateItemsAsync
        this.selectDepartmentForm._onChange = this.selectRoleForm.UpdateItemsAsync
        this.pagination._onChange = this.Refresh
        this.selectCompany._onChange = this.Refresh
        this.selectDepartment._onChange = this.Refresh
        this.selectRole._onChange = this.Refresh


        this.password.Width.value = '108px'
        this.searchName.PlaceholderCN.value = "用户名/昵称"
        this.searchName.PlaceholderEN.value = "Username/Nickname"
        this.searchName._onChange = this.Refresh
        this.searchName._onSearch = this.Refresh
        this.pagination.IsShowSelectedRowCount.value = true
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            await companyHelper.UpdateIdNames()
            await departmentHelper.UpdateIdNames()
            await roleHelper.UpdateIdNames()
            await this.selectCompany.UpdateItemsAsync()
            await this.selectDepartment.UpdateItemsAsync()
            await this.selectRole.UpdateItemsAsync()

            this.pagination.Count.value = await personHelper.GetCount({
                company: this.selectCompany.Value.value?.id,
                department: this.selectDepartment.Value.value?.id,
                role: this.selectRole.Value.value?.id,
                name: this.searchName.Value.value,
            })

            await personHelper.GetList({
                pageSize: this.pagination.PageSize.value,
                pageNumber: this.pagination.SelectedNum.value,
                company: this.selectCompany.Value.value?.id,
                department: this.selectDepartment.Value.value?.id,
                role: this.selectRole.Value.value?.id,
                name: this.searchName.Value.value,
            }).then(arr => {
                ArrayHelper.Set(personMgtTable.RowDatas, arr)
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 增 */
    readonly Add = async () => {
        this.personForm.Title.value = '新增人员'

        this.personForm._getSource = this.AddGetSource

        this.personForm._onSubmitAsync = async source => {
            const res = await personHelper.Add(source)
            await this.Refresh()
            return GetSubmitResult(res, Texts.AddedSuccessfully.value)
        }

        this.personForm.Show()
    }

    /** 改 */
    readonly Edit = () => {
        this.personForm.Title.value = '修改人员'

        this.personForm._getSource = () => {
            const rowData = personMgtTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return new PersonModel()
            }

            const data = ObjectHelper.ShallowCopy(rowData)
            data.password = ''
            return data
        }

        this.personForm._onSubmitAsync = async source => {
            const res = await personHelper.Edit(source)
            await this.Refresh()
            return GetSubmitResult(res, '修改成功')
        }

        this.personForm.Show(true)
    }

    /** 删 */
    readonly Delete = () => {
        DialogHelper.ShowDialog(
            '确认',
            '是否确定删除？',
            undefined,
            this.DeleteRowData,
            DialogMode.YesOrNo,
            Colors.Warning)
    }

    readonly DeleteRowData = async (state: DialogState) => {
        if (state != DialogState.Yes) return

        const model = personMgtTable.SelectedRowDatas.value[0]
        if (!model) {
            console.warn('The model is undefined!')
            return
        }

        try {
            loading.IsShow.value = true

            await personHelper.Delete(model.id).then(res => {
                this.Refresh()
                MyActionResult.ShowResult(res, '删除成功')
            })
        } finally {
            loading.IsShow.value = false
        }
    }
    //#endregion 【Functions】
}