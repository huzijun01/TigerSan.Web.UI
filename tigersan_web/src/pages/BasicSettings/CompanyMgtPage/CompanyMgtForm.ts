import { ref } from 'vue'
import { AxiosHelper } from '@/helpers'
import { navData } from '@/navs/navModel'
import { GetSubmitResult, MyActionResult } from '@/models'
import { tree, CompanyMgtModel, companyMgtTable, Companies2Tree, selectParentCompany, selectFormParentCompany } from './CompanyMgtTable'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig } from '@/0_tigersan_ui/tigerui'

const action = 'CompanyMgt'

/** “公司名称”项目配置 */
const configName: FormItemConfig = {
    _propName: 'name',
    PropText: '公司名称',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var company = source as CompanyMgtModel
        return Verify.IsNotUndefinedOrEmpty(company.name)
    }
}

/** “公司地址”项目配置 */
const configAddr: FormItemConfig = {
    _propName: 'addr',
    PropText: '公司地址',
    IsEquired: true,
    Target: ref<unknown>(),
    _isVerifyOk: (source) => {
        var company = source as CompanyMgtModel
        return Verify.IsNotUndefinedOrEmpty(company.addr)
    }
}

/** “父公司”项目配置 */
const configParentCompany: FormItemConfig = {
    _propName: 'parentCompany',
    PropText: '父公司',
    IsEquired: false,
    Target: selectFormParentCompany.Value
}

/** “增”源数据获取方法 */
const AddGetSource = () => {
    return new CompanyMgtModel()
}

/** “组织机构”表单配置 */
let configCompanyForm: FormConfig = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _itemConfigs: [
        configName,
        configAddr,
        configParentCompany,
    ]
}

/** “组织机构”表单模型 */
const companyForm = new FormModel(configCompanyForm)

/** 查 */
async function Refresh() {
    await AxiosHelper.GetAllList<CompanyMgtModel>(action)
        .then(arr => {
            tree.Nodes.splice(0)
            tree.Init(Companies2Tree(arr))
        })

    selectParentCompany.Items.splice(0)
    const names = tree.GetTexts()
    selectParentCompany.Items.push(...names)

    InitEvents()
}

/** 增 */
function Add() {
    companyForm.Title.value = '新增基站'

    companyForm._getSource = AddGetSource

    companyForm._onSubmitAsync = async source => {
        const res = await AxiosHelper.Post(action, source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    selectFormParentCompany.Items.splice(0)
    const indexes = tree.GetDatas().map(d => d.index)
    selectFormParentCompany.Items.push(...indexes)

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
        const res = await AxiosHelper.Put(action, source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    selectFormParentCompany.Items.splice(0)
    const indexes = tree.GetDatas().map(d => d.index).filter(i => i != model.index)
    selectFormParentCompany.Items.push(...indexes)

    companyForm.Show()
}

/** 删 */
function Delete() {
    const model = tree.ActiveData.value
    if (!model) {
        console.log('The model is undefined!')
        return
    }

    dialog.ShowDialog(
        '确认',
        '是否确定删除该公司及其下级公司？',
        model,
        DeleteRowData,
        DialogMode.YesOrNo,
        Colors.Warning)
}

function DeleteRowData(state: DialogState, model: CompanyMgtModel) {
    if (state != DialogState.Yes) return

    AxiosHelper.Delete(action, model.index)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

/** 初始化事件 */
function InitEvents() {
    companyMgtTable.RowDatas.forEach(r => {
        const company = r as CompanyMgtModel
        company.onDelete = Delete
        company.onEdit = Edit
        company.onClick = () => { navData.GoHome() }
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
    configParentCompany,
    companyForm,
    Refresh,
    Add,
    Edit,
    Delete,
    GoHome,
}