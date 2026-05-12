import { ref, computed } from 'vue'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, BigintHelper, ArrayHelper, PaginationModel, AuthorityHelper, authorityHelper, GetSubmitResult, IdNameModel, MyActionResult, AuthorityModel, loading } from '@/0_tigersan_ui/tigerui'
import { useUserInfo } from '@/stores'
import { roleMgtTable } from './RoleMgtTable'
import { companyHelper, roleHelper, departmentHelper, RoleAuthorityModel } from '@/models'

/** “权限助手”实例 */
const authorityHelperForm = new AuthorityHelper()
authorityHelperForm._tree._configs = authorityHelper._tree._configs

/** 是否显示“只读复选框” */
const isShowIsReadonly = computed(() => {
    const userInfo = useUserInfo()
    return authorityHelperForm._tree.IsActive.value && (userInfo.isRoot || userInfo.authorities.some(
        a => a.path === authorityHelperForm._tree.ActiveNode.value?.Path.value && !a.isReadonly
    ))
})

// 选择框:
/** 筛选 */
const selectCompany = companyHelper.GetIdNameSelectModel()
selectCompany._getItemsAsync = async () => await roleHelper.GetBelongCompanyListAsync()
const selectDepartment = departmentHelper.GetIdNameSelectModel()
selectDepartment._getItemsAsync = async () => selectCompany.Value.value ? await roleHelper.GetBelongDepartmentListAsync(selectCompany.Value.value?.id) : []
/** 表单 */
const selectCompanyForm = companyHelper.GetIdNameSelectModel()
const selectDepartmentForm = departmentHelper.GetIdNameSelectModel()
selectDepartmentForm._getItemsAsync = async () => selectCompanyForm.Value.value ? await departmentHelper.SelectIdNameByCompanyAsync(selectCompanyForm.Value.value?.id) : []
// 更新:
selectCompanyForm._onChange = selectDepartmentForm.UpdateItemsAsync

/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** “公司”项目配置 */
const configCompany: FormItemConfig<RoleAuthorityModel, IdNameModel> = {
    _propName: 'company',
    PropText: '公司',
    IsEquired: true,
    Target: selectCompanyForm.Value,
    _getValue: source => selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
    _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, '不可为空')
}

/** “部门”项目配置 */
const configDepartment: FormItemConfig<RoleAuthorityModel, IdNameModel> = {
    _propName: 'department',
    PropText: '部门',
    IsEquired: true,
    Target: selectDepartmentForm.Value,
    _getValue: source => selectDepartmentForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.department)),
    _setValue: (source, propName, value) => source.department = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.department, 0n, '不可为空')
}

/** “名称”项目配置 */
const configName: FormItemConfig<RoleAuthorityModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.name)
}

/** “权限”项目配置 */
const configAuthorities: FormItemConfig<RoleAuthorityModel, number> = {
    _propName: 'authorities',
    PropText: '权限',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsNotUndefined(source.authorities)
}

/** “增”源数据获取方法 */
const AddGetSource = () => new RoleAuthorityModel()

/** “角色”表单配置 */
let configRoleMgtForm: FormConfig<RoleAuthorityModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _itemConfigs: [
        configCompany,
        configDepartment,
        configName,
        configAuthorities,
    ],
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        selectCompanyForm.IsEnabled.value = !isEdit
        selectDepartmentForm.IsEnabled.value = !isEdit

        await companyHelper.UpdateIdNames()

        const userInfo = useUserInfo()
        let authorities: AuthorityModel[] = []
        if (isEdit) {
            const rowData = roleMgtTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return
            }

            await selectCompanyForm.UpdateItemsAsync()
            selectCompanyForm.Value.value = companyHelper.GetIdName(rowData.company)
            await selectDepartmentForm.UpdateItemsAsync()
            selectDepartmentForm.Value.value = departmentHelper.GetIdName(rowData.department)

            authorityHelperForm.InitTree(rowData.authorities)
            authorities = authorityHelperForm.GetAuthorities()
        } else {
            authorityHelperForm.InitTree()
            authorities = authorityHelperForm.GetAuthorities()
        }

        if (!userInfo.isRoot) {
            FilterAuthorities(authorities)
            authorityHelperForm.InitTree(authorities)

            authorityHelperForm._tree.NodeArray.value.forEach(node => {
                node.IsShow.value = userInfo.authorities.some(a => a.path === node.Path.value)
            })

            authorityHelperForm._tree.UpdateHeight()
        }
    }
}

/** “角色”表单模型 */
const roleForm = new FormModel(configRoleMgtForm)

/** 查 */
async function Refresh() {
    try {
        loading.IsShow.value = true

        await companyHelper.UpdateIdNames()
        await departmentHelper.UpdateIdNames()
        await selectCompany.UpdateItemsAsync()
        await selectDepartment.UpdateItemsAsync()

        pagination.Count.value = await roleHelper.GetCount({
            company: selectCompany.Value.value?.id,
            department: selectDepartment.Value.value?.id,
        })

        await roleHelper.GetList({
            pageSize: pagination.PageSize.value,
            pageNumber: pagination.SelectedNum.value,
            company: selectCompany.Value.value?.id,
            department: selectDepartment.Value.value?.id,
        }).then(arr => {
            ArrayHelper.Set(roleMgtTable.RowDatas, arr)
        })
    } finally {
        loading.IsShow.value = false
    }
}

pagination._onChange = Refresh
selectCompany._onChange = Refresh
selectDepartment._onChange = Refresh

/** 增 */
async function Add() {
    roleForm.Title.value = '新增角色'

    roleForm._getSource = AddGetSource

    roleForm._onSubmitAsync = async source => {
        source.authorities = authorityHelperForm.GetAuthorities()
        const res = await roleHelper.Add(source)

        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    roleForm.Show()
}

/** 改 */
async function Edit() {
    roleForm.Title.value = '修改角色'

    roleForm._getSource = () => {
        const rowData = roleMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new RoleAuthorityModel()
        }

        return ObjectHelper.ShallowCopy(rowData)
    }

    roleForm._onSubmitAsync = async source => {
        source.authorities = authorityHelperForm.GetAuthorities()
        const res = await roleHelper.Edit(source)

        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    roleForm.Show(true)
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

async function DeleteRowData(state: DialogState) {
    if (state != DialogState.Yes) return

    const model = roleMgtTable.SelectedRowDatas.value[0]
    if (!model) {
        console.warn('The model is undefined!')
        return {}
    }

    try {
        loading.IsShow.value = true

        await roleHelper.Delete(model.id).then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
    } finally {
        loading.IsShow.value = false
    }
}

/** 过滤权限 */
function FilterAuthorities(authorities: AuthorityModel[]) {
    const userInfo = useUserInfo()
    const unavailables = new Array<AuthorityModel>

    authorities.forEach(authority => {
        const find = userInfo.authorities.find(i => i.path === authority.path);
        if (!find) {
            unavailables.push(authority)
            return
        }

        if (find.isReadonly) {
            authority.isReadonly = true
            return
        }
    })

    unavailables.forEach(u => ArrayHelper.Delete(authorities, u))
}

export const roleMgtForm = {
    authorityHelperForm,
    isShowIsReadonly,
    pagination,
    selectCompany,
    selectDepartment,
    selectCompanyForm,
    selectDepartmentForm,
    configCompany,
    configDepartment,
    configName,
    configAuthorities,
    roleForm,
    Refresh,
    Add,
    Edit,
    Delete,
    FilterAuthorities,
}