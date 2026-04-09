import { ref } from 'vue'
import { batchMgtTable, pagination } from './BatchMgtTable'
import { GetSubmitResult, MyActionResult, IdNameModel, companyMgtHelper, scenarioMgtHelper, batchMgtHelper, BatchModel } from '@/models'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, ArrayHelper, BigintHelper, PasswordModel, SearchModel } from '@/0_tigersan_ui/tigerui'

// 选择框:
/** 筛选 */
const selectCompany = companyMgtHelper.GetSelectModel()
const selectScenario = scenarioMgtHelper.GetSelectModel()
/** 表单 */
const selectCompanyForm = companyMgtHelper.GetSelectModel()
const selectScenarioForm = scenarioMgtHelper.GetSelectModel()
// 更新:
selectCompanyForm._onChange = selectScenarioForm.UpdateItemsAsync

/** 搜索框 */
const searchBatchId = new SearchModel()
searchBatchId.PlaceholderCN.value = "请输入批次"
searchBatchId._onChange = Refresh
searchBatchId._onSearch = Refresh

/** 密码框 */
let isPasswordChanged = false
const password = new PasswordModel()
password.Width.value = '108px'

/** “公司”项目配置 */
const configCompany: FormItemConfig<BatchModel, IdNameModel> = {
    _propName: 'company',
    PropText: '公司',
    IsEquired: true,
    Target: selectCompanyForm.Value,
    _getValue: source => selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
    _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
    // _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, '不可为空')
}

/** “场景”项目配置 */
const configScenario: FormItemConfig<BatchModel, IdNameModel> = {
    _propName: 'scenario',
    PropText: '场景',
    IsEquired: true,
    Target: selectScenarioForm.Value,
    _getValue: source => selectScenarioForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.scenario)),
    _setValue: (source, propName, value) => source.scenario = value && value.id != undefined ? value.id : 0n,
    // _isVerifyOk: source => Verify.IsBigintGreaterThan(source.scenario, 0n, '不可为空')
}

/** “批次”项目配置 */
const configBatchId: FormItemConfig<BatchModel, string> = {
    _propName: 'batchId',
    PropText: '批次',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.batchId)
}

/** “联系人”项目配置 */
const configManager: FormItemConfig<BatchModel, string> = {
    _propName: 'manager',
    PropText: '联系人',
    IsEquired: false,
    Target: ref(),
}

/** “电话”项目配置 */
const configPhone: FormItemConfig<BatchModel, string> = {
    _propName: 'phone',
    PropText: '电话',
    IsEquired: false,
    Target: ref(),
    _isVerifyOk: source => Verify.IsValidPhoneNumber(source.phone)
}

/** “电话”项目配置 */
const configComment: FormItemConfig<BatchModel, string> = {
    _propName: 'comment',
    PropText: '备注',
    IsEquired: false,
    Target: ref(),
}

/** “增”源数据获取方法 */
const AddGetSource = () => new BatchModel()

/** “批次管理”表单配置 */
let configBatchMgtForm: FormConfig<BatchModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        isPasswordChanged = false
        password.IsShowValue.value = false
        if (isEdit) {
            const rowData = batchMgtTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return
            }

            await selectCompanyForm.UpdateItemsAsync()
            selectCompanyForm.Value.value = companyMgtHelper.GetIdName(rowData.company)
            await selectScenarioForm.UpdateItemsAsync()
            selectScenarioForm.Value.value = scenarioMgtHelper.GetIdName(rowData.scenario)
        }
    },
    _itemConfigs: [
        configCompany,
        configScenario,
        configBatchId,
        configManager,
        configPhone,
        configComment,
    ]
}

/** “批次管理”表单模型 */
const batchMgtForm = new FormModel(configBatchMgtForm)

/** 查 */
async function Refresh() {
    await companyMgtHelper.UpdateIdNames()
    await scenarioMgtHelper.UpdateIdNames()
    await selectCompany.UpdateItemsAsync()
    await selectScenario.UpdateItemsAsync()

    pagination.Count.value = await batchMgtHelper.GetCountAsync({
        company: selectCompany.Value.value?.id,
        scenario: selectScenario.Value.value?.id,
        batchId: searchBatchId.Value.value,
    })
    await batchMgtHelper.GetListAsync({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
        company: selectCompany.Value.value?.id,
        scenario: selectScenario.Value.value?.id,
        batchId: searchBatchId.Value.value,
    }).then(arr => {
        ArrayHelper.Set(batchMgtTable.RowDatas, arr)
    })
}

pagination._onChange = Refresh
selectCompany._onChange = Refresh
selectScenario._onChange = Refresh

/** 增 */
async function Add() {
    batchMgtForm.Title.value = '新增批次'

    batchMgtForm._getSource = AddGetSource

    batchMgtForm._onSubmitAsync = async source => {
        const res = await batchMgtHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    batchMgtForm.Show()
}

/** 改 */
async function Edit() {
    batchMgtForm.Title.value = '修改批次'

    batchMgtForm._getSource = () => {
        const rowData = batchMgtTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new BatchModel()
        }

        return ObjectHelper.ShallowCopy(rowData)
    }

    batchMgtForm._onSubmitAsync = async source => {
        const res = await batchMgtHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    batchMgtForm.Show(true)
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

    const model = batchMgtTable.SelectedRowDatas.value[0]
    if (!model) {
        console.warn('The model is undefined!')
        return {}
    }

    batchMgtHelper.Delete(model.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export default {
    password,
    searchBatchId,
    selectCompany,
    selectScenario,
    selectCompanyForm,
    selectScenarioForm,
    configCompany,
    configScenario,
    configBatchId,
    configManager,
    configPhone,
    configComment,
    batchMgtForm,
    Refresh,
    Add,
    Edit,
    Delete,
}