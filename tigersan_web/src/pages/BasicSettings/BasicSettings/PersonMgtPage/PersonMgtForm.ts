import { ref } from 'vue'
import { AxiosHelper } from '@/helpers'
import { GetSubmitResult, MyActionResult } from '@/models'
import type { RoleMgtModel } from '../RoleMgt/RoleMgtTable'
import { selectRole, PersonMgtModel, personMgtTable, pagination } from './PersonMgtTable'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig } from '@/0_tigersan_ui/tigerui'

const action = 'PersonMgt'

/** “角色”项目配置 */
const configRole: FormItemConfig<PersonMgtModel> = {
    _propName: 'Role',
    PropText: '角色',
    IsEquired: true,
    Target: selectRole.Value,
    _isVerifyOk: source => {
        return Verify.IsNotUndefined(source)
    }
}

/** “用户名”项目配置 */
const configUsername: FormItemConfig<PersonMgtModel> = {
    _propName: 'Username',
    PropText: '用户名',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.username)
    }
}

/** “昵称”项目配置 */
const configNickname: FormItemConfig<PersonMgtModel> = {
    _propName: 'Nickname',
    PropText: '昵称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.nickname)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new PersonMgtModel()
}

/** “人员管理”表单配置 */
let configBaseStationForm: FormConfig<PersonMgtModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configRole,
        configNickname,
        configUsername,
    ]
}

/** “人员管理”表单模型 */
const baseStationForm = new FormModel(configBaseStationForm)

async function UpdateRoles() {
    selectRole.Items.splice(0)
    const roles = await AxiosHelper.GetAllList<RoleMgtModel>('RoleMgt')
    selectRole.Items.push(...roles)
}

/** 查 */
async function Refresh() {
    const arr = await AxiosHelper.GetAllList<PersonMgtModel>(action)
    personMgtTable.RowDatas.splice(0)
    personMgtTable.RowDatas.push(...arr)
    const count = await AxiosHelper.GetCount(action)
    pagination.Count.value = count
}

/** 增 */
async function Add() {
    baseStationForm.Title.value = '新增人员'

    baseStationForm._getSource = AddGetSource

    baseStationForm._onSubmitAsync = async source => {
        const res = await AxiosHelper.Post(action, source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    UpdateRoles()

    baseStationForm.Show()
}

/** 改 */
function Edit() {
    baseStationForm.Title.value = '修改人员'

    baseStationForm._getSource = () => {
        const rowData = personMgtTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new PersonMgtModel()
        }

        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    baseStationForm._onSubmitAsync = async source => {
        const res = await AxiosHelper.Put(action, source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    UpdateRoles()

    baseStationForm.Show()
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

    AxiosHelper.Delete(action, model.index)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export default {
    configRole,
    configNickname,
    configUsername,
    baseStationForm,
    Refresh,
    Add,
    Edit,
    Delete,
}