import { ref } from 'vue'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, BigintHelper, ArrayHelper, PaginationModel, AuthorityHelper, authorityHelper, GetSubmitResult, IdNameModel, MyActionResult } from '@/0_tigersan_ui/tigerui'
import { roleMgtTable } from './RoleMgtTable'
import { companyMgtHelper, roleMgtHelper, departmentMgtHelper, RoleAuthorityModel } from '@/models'

/** “权限助手”实例 */
const authorityHelperForm = new AuthorityHelper()
authorityHelperForm._tree._configs = authorityHelper._tree._configs

// 选择框:
/** 筛选 */
const selectCompany = companyMgtHelper.GetIdNameSelectModel()
selectCompany._getItemsAsync = async () => await roleMgtHelper.GetBelongCompanyListAsync()
const selectDepartment = departmentMgtHelper.GetIdNameSelectModel()
selectDepartment._getItemsAsync = async () => selectCompany.Value.value ? await roleMgtHelper.GetBelongDepartmentListAsync(selectCompany.Value.value?.id) : []
/** 表单 */
const selectCompanyForm = companyMgtHelper.GetIdNameSelectModel()
const selectDepartmentForm = departmentMgtHelper.GetIdNameSelectModel()
selectDepartmentForm._getItemsAsync = async () => selectCompanyForm.Value.value ? await departmentMgtHelper.SelectIdNameByCompanyAsync(selectCompanyForm.Value.value?.id) : []
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

/** “角色管理”表单配置 */
let configRoleMgtForm: FormConfig<RoleAuthorityModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        selectCompanyForm.IsEnabled.value = !isEdit
        selectDepartmentForm.IsEnabled.value = !isEdit

        await companyMgtHelper.UpdateIdNames()

        if (isEdit) {
            const rowData = roleMgtTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return
            }

            await selectCompanyForm.UpdateItemsAsync()
            selectCompanyForm.Value.value = companyMgtHelper.GetIdName(rowData.company)
            await selectDepartmentForm.UpdateItemsAsync()
            selectDepartmentForm.Value.value = departmentMgtHelper.GetIdName(rowData.department)

            authorityHelperForm.InitTree(rowData.authorities)
        } else {
            authorityHelperForm.InitTree()
        }
    },
    _itemConfigs: [
        configCompany,
        configDepartment,
        configName,
        configAuthorities,
    ]
}

/** “角色管理”表单模型 */
const roleMgtForm = new FormModel(configRoleMgtForm)

/** 查 */
async function Refresh() {
    await companyMgtHelper.UpdateIdNames()
    await departmentMgtHelper.UpdateIdNames()
    await selectCompany.UpdateItemsAsync()
    await selectDepartment.UpdateItemsAsync()

    pagination.Count.value = await roleMgtHelper.GetCount({
        company: selectCompany.Value.value?.id,
        department: selectDepartment.Value.value?.id,
    })
    await roleMgtHelper.GetList({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
        company: selectCompany.Value.value?.id,
        department: selectDepartment.Value.value?.id,
    }).then(arr => {
        ArrayHelper.Set(roleMgtTable.RowDatas, arr)
    })
}

pagination._onChange = Refresh
selectCompany._onChange = Refresh
selectDepartment._onChange = Refresh

/** 增 */
async function Add() {
    roleMgtForm.Title.value = '新增角色'

    roleMgtForm._getSource = AddGetSource

    roleMgtForm._onSubmitAsync = async source => {
        source.authorities = authorityHelperForm.GetAuthorities()
        const res = await roleMgtHelper.Add(source)

        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    roleMgtForm.Show()
}

/** 改 */
async function Edit() {
    roleMgtForm.Title.value = '修改角色'

    roleMgtForm._getSource = () => {
        const rowData = roleMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new RoleAuthorityModel()
        }

        return ObjectHelper.ShallowCopy(rowData)
    }

    roleMgtForm._onSubmitAsync = async source => {
        source.authorities = authorityHelperForm.GetAuthorities()
        const res = await roleMgtHelper.Edit(source)

        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    roleMgtForm.Show(true)
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

    const model = roleMgtTable.SelectedRowDatas.value[0]
    if (!model) {
        console.warn('The model is undefined!')
        return {}
    }

    roleMgtHelper.Delete(model.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export default {
    authorityHelperForm,
    pagination,
    selectCompany,
    selectDepartment,
    selectCompanyForm,
    selectDepartmentForm,
    configCompany,
    configDepartment,
    configName,
    configAuthorities,
    roleMgtForm,
    Refresh,
    Add,
    Edit,
    Delete,
}