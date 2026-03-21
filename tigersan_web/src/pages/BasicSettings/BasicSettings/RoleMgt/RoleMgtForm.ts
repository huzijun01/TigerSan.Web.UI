import { ref } from 'vue'
import { authorityHelper } from '@/helpers'
import { CompanyModel } from '../CompanyMgtPage/CompanyMgtTable'
import { selectCompany, roleMgtTable, pagination, GetCompany } from './RoleMgtTable'
import { GetSubmitResult, MyActionResult, RoleModel, companyMgtHelper, roleMgtHelper } from '@/models'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, BigintHelper } from '@/0_tigersan_ui/tigerui'

/** “公司”项目配置 */
const configCompany: FormItemConfig<RoleModel, CompanyModel> = {
    _propName: 'company',
    PropText: '公司',
    IsEquired: true,
    Target: selectCompany.Value,
    _getValue: source => selectCompany.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
    _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => {
        return Verify.IsBigintGreaterThan(source.company)
    }
}

/** “名称”项目配置 */
const configName: FormItemConfig<RoleModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.name)
    }
}

/** “权限”项目配置 */
const configAuthority: FormItemConfig<RoleModel, number> = {
    _propName: 'authority',
    PropText: '权限',
    IsEquired: true,
    Target: ref(),
    // _isVerifyOk: source => {
    //     return Verify.IsNotUndefinedOrEmpty(source.company, 0)
    // }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new RoleModel()
}

/** “角色管理”表单配置 */
let configRoleMgtForm: FormConfig<RoleModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configCompany,
        configName,
        configAuthority,
    ]
}

/** “角色管理”表单模型 */
const roleMgtForm = new FormModel(configRoleMgtForm)

async function UpdateCompanies() {
    selectCompany.Items.splice(0)
    const roles = await companyMgtHelper.GetAllList()
    selectCompany.Items.push(...roles)
}

/** 查 */
async function Refresh() {
    await UpdateCompanies()
    const arr = await roleMgtHelper.GetAllList()
    roleMgtTable.RowDatas.splice(0)
    roleMgtTable.RowDatas.push(...arr)
    const count = await roleMgtHelper.GetCount()
    pagination.Count.value = count
}

/** 增 */
async function Add() {
    authorityHelper.Init()

    roleMgtForm.Title.value = '新增角色'

    roleMgtForm._getSource = AddGetSource

    roleMgtForm._onSubmitAsync = async source => {
        const res = await roleMgtHelper.Add(source)
        await authorityHelper.SaveModels()
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    await UpdateCompanies()

    roleMgtForm.Show()
}

/** 改 */
async function Edit() {
    authorityHelper.Init()

    roleMgtForm.Title.value = '修改角色'

    roleMgtForm._getSource = () => {
        const rowData = roleMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new RoleModel()
        }

        if (rowData.id === undefined) {
            console.warn('The id is undefined!')
            return new RoleModel()
        }

        authorityHelper.Update(rowData.id)

        selectCompany.Value.value = GetCompany(rowData)

        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    roleMgtForm._onSubmitAsync = async source => {
        const res = await roleMgtHelper.Edit(source)

        if (source.id === undefined) {
            return GetSubmitResult(MyActionResult.GetError('The id is undefined!'), '添加成功')
        }

        authorityHelper.SaveModels()

        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    await UpdateCompanies()

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
    configName,
    configAuthority,
    roleMgtForm,
    Refresh,
    Add,
    Edit,
    Delete,
}