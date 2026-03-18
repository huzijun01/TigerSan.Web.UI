import { ref } from 'vue'
import { AuthorityHelper, AxiosHelper } from '@/helpers'
import { GetSubmitResult, MyActionResult } from '@/models'
import { AuthorityMgtModel, authorityMgtTable, pagination } from './AuthorityMgtTable'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig } from '@/0_tigersan_ui/tigerui'

const action = 'AuthorityMgt'

/** 是否“只读” */
const isReadonly = ref(false)

/** “权限”树模型 */
const treeAuthority = AuthorityHelper.GetTreeModel()
treeAuthority._onInit = node => {
    if (node._data) {
        node.Color.value = Colors.Warning
    }
}
treeAuthority._onActive = node => {
    if (node._data === undefined) {
        console.warn('The _data is undefined!')
        return
    }
    isReadonly.value = node._data
}

/** 设置“是否只读” */
function SetIsReadonly() {
    const node = treeAuthority.ActiveNode.value
    if (node) {
        node._data = isReadonly.value
        node.Color.value = isReadonly.value ? Colors.Warning : ''
    }
}

/** “名称”项目配置 */
const configName: FormItemConfig<AuthorityMgtModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.name)
    }
}

/** “权限”项目配置 */
const configAuthority: FormItemConfig<AuthorityMgtModel, number> = {
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
    return new AuthorityMgtModel()
}

/** “权限管理”表单配置 */
let configAuthorityMgtForm: FormConfig<AuthorityMgtModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configName,
        configAuthority,
    ]
}

/** “权限管理”表单模型 */
const authorityMgtForm = new FormModel(configAuthorityMgtForm)

/** 查 */
async function Refresh() {
    const arr = await AxiosHelper.GetAllList<AuthorityMgtModel>(action)
    authorityMgtTable.RowDatas.splice(0)
    authorityMgtTable.RowDatas.push(...arr)
    const count = await AxiosHelper.GetCount(action)
    pagination.Count.value = count
}

/** 增 */
async function Add() {
    authorityMgtForm.Title.value = '新增权限'

    authorityMgtForm._getSource = AddGetSource

    authorityMgtForm._onSubmitAsync = async source => {
        const res = await AxiosHelper.Post(action, source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    authorityMgtForm.Show()
}

/** 改 */
async function Edit() {
    authorityMgtForm.Title.value = '修改权限'

    authorityMgtForm._getSource = () => {
        const rowData = authorityMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new AuthorityMgtModel()
        }

        return ObjectHelper.ObjectShallowCopy(rowData)
    }

    authorityMgtForm._onSubmitAsync = async source => {
        const res = await AxiosHelper.Put(action, source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    authorityMgtForm.Show()
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

    const model = authorityMgtTable.SelectedRowDatas.value[0]
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
    isReadonly,
    treeAuthority,
    configName,
    configAuthority,
    authorityMgtForm,
    Refresh,
    Add,
    Edit,
    Delete,
    SetIsReadonly,
}