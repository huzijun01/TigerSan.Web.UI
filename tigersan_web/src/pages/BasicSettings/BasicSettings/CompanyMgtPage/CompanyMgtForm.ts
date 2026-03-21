import { ref } from 'vue'
import { navData } from '@/navs/navModel'
import { tree, CompanyModel, selectParent, selectFormParent } from './CompanyMgtTable'
import { CompanyMgtHelper, companyMgtHelper, GetSubmitResult, MyActionResult } from '@/models'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig } from '@/0_tigersan_ui/tigerui'

/** “公司名称”项目配置 */
const configName: FormItemConfig<CompanyModel, string> = {
    _propName: 'name',
    PropText: '公司名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.name)
    }
}

/** “公司地址”项目配置 */
const configAddr: FormItemConfig<CompanyModel, string> = {
    _propName: 'addr',
    PropText: '公司地址',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.addr)
    }
}

/** “父公司”项目配置 */
const configParent: FormItemConfig<CompanyModel, bigint | undefined> = {
    _propName: 'parent',
    PropText: '父公司',
    IsEquired: false,
    Target: selectFormParent.Value
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new CompanyModel()
}

/** “组织机构”表单配置 */
let configCompanyForm: FormConfig<CompanyModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configName,
        configAddr,
        configParent,
    ]
}

/** “组织机构”表单模型 */
const companyForm = new FormModel(configCompanyForm)

/** 查 */
async function Refresh() {
    await companyMgtHelper.GetAllList()
        .then(arr => {
            tree.Nodes.splice(0)
            tree.Init(CompanyMgtHelper.Companies2Tree(arr))
        })

    selectParent.Items.splice(0)
    const names = tree.GetTexts()
    selectParent.Items.push(...names)
}

/** 增 */
function Add() {
    companyForm.Title.value = '新增基站'

    companyForm._getSource = AddGetSource

    companyForm._onSubmitAsync = async source => {
        const res = await companyMgtHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    selectFormParent.Items.splice(0)
    const indexes = tree.GetDatas().map(d => d.id).filter(i => i != undefined)
    selectFormParent.Items.push(...indexes)

    companyForm.Show()
}

/** 改 */
function Edit() {
    const model = tree.ActiveData.value
    if (!model) {
        console.log('The model is undefined!')
        return
    }

    companyForm.Title.value = '修改基站'

    companyForm._getSource = () => {
        return ObjectHelper.ObjectShallowCopy(model)
    }

    companyForm._onSubmitAsync = async source => {
        const res = await companyMgtHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    selectFormParent.Items.splice(0)
    const indexes = tree.GetDatas().map(d => d.id).filter(i => i != undefined).filter(i => i != model.id)
    selectFormParent.Items.push(...indexes)

    companyForm.Show()
}

/** 删 */
function Delete() {
    dialog.ShowDialog(
        '确认',
        '是否确定删除该公司及其下级公司？',
        undefined,
        DeleteRowData,
        DialogMode.YesOrNo,
        Colors.Warning)
}

function DeleteRowData(state: DialogState) {
    if (state != DialogState.Yes) return

    const model = tree.ActiveData.value
    if (!model) {
        console.log('The model is undefined!')
        return
    }

    companyMgtHelper.Delete(model.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

/** 进入主页 */
function GoHome() {
    navData.GoHome()
}

export default {
    tree,
    configName,
    configAddr,
    configParent,
    companyForm,
    Refresh,
    Add,
    Edit,
    Delete,
    GoHome,
}