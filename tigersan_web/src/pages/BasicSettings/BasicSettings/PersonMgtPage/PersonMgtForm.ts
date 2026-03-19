import { ref } from 'vue'
import { selectRole, PersonMgtModel, personMgtTable, pagination } from './PersonMgtTable'
import { GetSubmitResult, MyActionResult, RoleMgtModel, personMgtHelper, roleMgtHelper } from '@/models'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig } from '@/0_tigersan_ui/tigerui'

/** “角色”项目配置 */
const configRole: FormItemConfig<PersonMgtModel, RoleMgtModel> = {
    _propName: 'role',
    PropText: '角色',
    IsEquired: true,
    Target: selectRole.Value,
    _getValue: source => selectRole.Items.find(i => i.id === source.role),
    _setValue: (source, propName, value) => source.role = value && value.id != undefined ? value.id : -1,
    _isVerifyOk: source => {
        return Verify.IsGreaterThan(source.role, 0, '不可为空')
    }
}

/** “用户名”项目配置 */
const configUsername: FormItemConfig<PersonMgtModel, string> = {
    _propName: 'username',
    PropText: '用户名',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsValidUsername(source.username)
    }
}

/** “昵称”项目配置 */
const configNickname: FormItemConfig<PersonMgtModel, string> = {
    _propName: 'nickname',
    PropText: '昵称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.nickname)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => new PersonMgtModel()

/** “人员管理”表单配置 */
let configPersonMgtForm: FormConfig<PersonMgtModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configRole,
        configUsername,
        configNickname,
    ]
}

/** “人员管理”表单模型 */
const personMgtForm = new FormModel(configPersonMgtForm)

async function UpdateRoles() {
    selectRole.Items.splice(0)
    const roles = await roleMgtHelper.GetAllList()
    selectRole.Items.push(...roles)
}

/** 查 */
async function Refresh() {
    await UpdateRoles()
    const arr = await personMgtHelper.GetAllList()
    personMgtTable.RowDatas.splice(0)
    personMgtTable.RowDatas.push(...arr)
    const count = await personMgtHelper.GetCount()
    pagination.Count.value = count
}

/** 增 */
async function Add() {
    personMgtForm.Title.value = '新增人员'

    personMgtForm._getSource = AddGetSource

    personMgtForm._onSubmitAsync = async source => {
        const res = await personMgtHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    await UpdateRoles()

    personMgtForm.Show()
}

/** 改 */
async function Edit() {
    personMgtForm.Title.value = '修改人员'

    personMgtForm._getSource = () => {
        const rowData = personMgtTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new PersonMgtModel()
        }

        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    personMgtForm._onSubmitAsync = async source => {
        const res = await personMgtHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    await UpdateRoles()

    personMgtForm.Show()
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

    if (model.id === undefined) {
        console.warn('The id is undefined!')
        return
    }

    personMgtHelper.Delete(model.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export default {
    configRole,
    configNickname,
    configUsername,
    baseStationForm: personMgtForm,
    Refresh,
    Add,
    Edit,
    Delete,
}