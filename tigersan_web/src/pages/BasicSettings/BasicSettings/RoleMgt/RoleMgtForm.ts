import { ref } from 'vue'
import { AxiosHelper } from '@/helpers'
import { GetSubmitResult, MyActionResult } from '@/models'
import { CompanyMgtModel } from '../CompanyMgtPage/CompanyMgtTable'
import { selectCompany, RoleMgtModel, roleMgtTable, pagination, GetCompany } from './RoleMgtTable'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig } from '@/0_tigersan_ui/tigerui'

const action = 'RoleMgt'

/** “公司”项目配置 */
const configCompany: FormItemConfig<RoleMgtModel, CompanyMgtModel> = {
    _propName: 'company',
    PropText: '公司',
    IsEquired: true,
    Target: selectCompany.Value,
    _getValue: source => selectCompany.Items.find(i => i.index === source.index),
    _setValue: (source, propName, value) => source.company = value ? value.index : -1,
    _isVerifyOk: source => {
        return Verify.IsGreaterThan(source.company, 0, '不可为空')
    }
}

/** “名称”项目配置 */
const configName: FormItemConfig<RoleMgtModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.name)
    }
}

/** “权限”项目配置 */
const configAuthority: FormItemConfig<RoleMgtModel, number> = {
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
    return new RoleMgtModel()
}

/** “角色管理”表单配置 */
let configRoleMgtForm: FormConfig<RoleMgtModel> = {
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
    const roles = await AxiosHelper.GetAllList<CompanyMgtModel>('CompanyMgt')
    selectCompany.Items.push(...roles)
}

/** 查 */
async function Refresh() {
    await UpdateCompanies()
    const arr = await AxiosHelper.GetAllList<RoleMgtModel>(action)
    roleMgtTable.RowDatas.splice(0)
    roleMgtTable.RowDatas.push(...arr)
    const count = await AxiosHelper.GetCount(action)
    pagination.Count.value = count
}

/** 增 */
async function Add() {
    roleMgtForm.Title.value = '新增角色'

    roleMgtForm._getSource = AddGetSource

    roleMgtForm._onSubmitAsync = async source => {
        const res = await AxiosHelper.Post(action, source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    await UpdateCompanies()

    roleMgtForm.Show()
}

/** 改 */
async function Edit() {
    roleMgtForm.Title.value = '修改角色'

    roleMgtForm._getSource = () => {
        const rowData = roleMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new RoleMgtModel()
        }

        selectCompany.Value.value = GetCompany(rowData)

        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    roleMgtForm._onSubmitAsync = async source => {
        const res = await AxiosHelper.Put(action, source)
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

    AxiosHelper.Delete(action, model.index)
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