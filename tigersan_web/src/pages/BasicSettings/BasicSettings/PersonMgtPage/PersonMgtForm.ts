import { ref } from 'vue'
import { selectRole, PersonModel, personMgtTable, pagination } from './PersonMgtTable'
import { GetSubmitResult, MyActionResult, IdNameModel, companyMgtHelper, departmentMgtHelper, personMgtHelper, roleMgtHelper } from '@/models'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig } from '@/0_tigersan_ui/tigerui'

/** “角色”项目配置 */
const configRole: FormItemConfig<PersonModel, IdNameModel> = {
    _propName: 'role',
    PropText: '角色',
    IsEquired: true,
    Target: selectRole.Value,
    _getValue: source => selectRole.Items.find(i => i.id === source.role),
    _setValue: (source, propName, value) => source.role = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => {
        return Verify.IsBigintGreaterThan(source.role)
    }
}

/** “用户名”项目配置 */
const configUsername: FormItemConfig<PersonModel, string> = {
    _propName: 'username',
    PropText: '用户名',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsValidUsername(source.username)
    }
}

/** “昵称”项目配置 */
const configNickname: FormItemConfig<PersonModel, string> = {
    _propName: 'nickname',
    PropText: '昵称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.nickname)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => new PersonModel()

/** “人员管理”表单配置 */
let configPersonMgtForm: FormConfig<PersonModel> = {
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

/** 查 */
async function Refresh() {
    await companyMgtHelper.UpdateIdNamesAsync()
    await departmentMgtHelper.UpdateIdNamesAsync()
    await roleMgtHelper.UpdateIdNamesAsync()

    const arr = await personMgtHelper.GetList()
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

    await companyMgtHelper.UpdateIdNamesAsync()
    await departmentMgtHelper.UpdateIdNamesAsync()
    await roleMgtHelper.UpdateIdNamesAsync()
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

        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    personMgtForm._onSubmitAsync = async source => {
        const res = await personMgtHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    await companyMgtHelper.UpdateIdNamesAsync()
    await departmentMgtHelper.UpdateIdNamesAsync()
    await roleMgtHelper.UpdateIdNamesAsync()
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