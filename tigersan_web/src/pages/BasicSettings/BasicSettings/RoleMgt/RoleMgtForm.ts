import { ref } from 'vue'
import { authorityHelper } from '@/helpers'
import { selectCompany, roleMgtTable, pagination, selectDepartment } from './RoleMgtTable'
import { GetSubmitResult, IdNameModel, MyActionResult, RoleAuthorityModel, companyMgtHelper, departmentMgtHelper, roleMgtHelper } from '@/models'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, BigintHelper } from '@/0_tigersan_ui/tigerui'

/** “公司”项目配置 */
const configCompany: FormItemConfig<RoleAuthorityModel, IdNameModel> = {
    _propName: 'company',
    PropText: '公司',
    IsEquired: true,
    Target: selectCompany.Value,
    _getValue: async source => {
        return selectCompany.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company))
    },
    _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => {
        return Verify.IsBigintGreaterThan(source.company)
    }
}

/** “部门”项目配置 */
const configDepartment: FormItemConfig<RoleAuthorityModel, IdNameModel> = {
    _propName: 'department',
    PropText: '部门',
    IsEquired: true,
    Target: selectDepartment.Value,
    _getValue: async source => {
        return selectDepartment.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.department))
    },
    _setValue: (source, propName, value) => source.department = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => {
        return Verify.IsBigintGreaterThan(source.department)
    }
}

/** “名称”项目配置 */
const configName: FormItemConfig<RoleAuthorityModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.name)
    }
}

/** “权限”项目配置 */
const configAuthority: FormItemConfig<RoleAuthorityModel, number> = {
    _propName: 'authority',
    PropText: '权限',
    IsEquired: true,
    Target: ref(),
    // _isVerifyOk: source => {
    //     return Verify.IsNotUndefinedOrEmpty(source.company, 0)
    // }
}

/** “增”源数据获取方法 */
const AddGetSource = () => new RoleAuthorityModel()

/** “角色管理”表单配置 */
let configRoleMgtForm: FormConfig<RoleAuthorityModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        await selectCompany.UpdateItemsAsync()
        await selectDepartment.UpdateItemsAsync()
    },
    _itemConfigs: [
        configCompany,
        configDepartment,
        configName,
        configAuthority,
    ]
}

/** “角色管理”表单模型 */
const roleMgtForm = new FormModel(configRoleMgtForm)

/** 查 */
async function Refresh() {
    await companyMgtHelper.UpdateIdNamesAsync()
    await departmentMgtHelper.UpdateIdNamesAsync()

    const arr = await roleMgtHelper.GetList()
    roleMgtTable.RowDatas.splice(0)
    roleMgtTable.RowDatas.push(...arr)

    const count = await roleMgtHelper.GetCount()
    pagination.Count.value = count
}

/** 增 */
async function Add() {
    roleMgtForm.Title.value = '新增角色'

    roleMgtForm._getSource = AddGetSource

    roleMgtForm._onSubmitAsync = async source => {
        source.authorities = await authorityHelper.GetModels()
        const res = await roleMgtHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    selectCompany.IsEnabled.value = true
    selectDepartment.IsEnabled.value = true
    authorityHelper.Init()
    await companyMgtHelper.UpdateIdNamesAsync()
    await departmentMgtHelper.UpdateIdNamesAsync()
    roleMgtForm.Show()
}

/** 改 */
async function Edit() {
    const rowData = roleMgtTable.SelectedRowDatas.value[0]

    if (!rowData) {
        console.warn('The rowData is undefined!')
        return new RoleAuthorityModel()
    }

    roleMgtForm.Title.value = '修改角色'

    roleMgtForm._getSource = () => {
        if (rowData.id === undefined) {
            console.warn('The id is undefined!')
            return new RoleAuthorityModel()
        }

        selectCompany.Value.value = companyMgtHelper.GetIdName(rowData.company)
        selectDepartment.Value.value = departmentMgtHelper.GetIdName(rowData.department)

        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    roleMgtForm._onSubmitAsync = async source => {
        source.authorities = await authorityHelper.GetModels()
        const res = await roleMgtHelper.Edit(source)

        if (source.id === undefined) {
            return GetSubmitResult(MyActionResult.GetError('The id is undefined!'), '添加成功')
        }

        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    selectCompany.IsEnabled.value = false
    selectDepartment.IsEnabled.value = false
    authorityHelper.Init(rowData.authorities)
    await companyMgtHelper.UpdateIdNamesAsync()
    await departmentMgtHelper.UpdateIdNamesAsync()
    roleMgtForm.Show()
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

    if (model.id === undefined) {
        console.warn('The id is undefined!')
        return
    }

    roleMgtHelper.Delete(model.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export default {
    configCompany,
    configDepartment,
    configName,
    configAuthority,
    roleMgtForm,
    Refresh,
    Add,
    Edit,
    Delete,
}