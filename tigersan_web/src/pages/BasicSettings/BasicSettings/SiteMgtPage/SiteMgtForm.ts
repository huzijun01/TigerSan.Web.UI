import { ref } from 'vue'
import { siteMgtTable } from './SiteMgtTable'
import { GetSubmitResult, IdNameModel, MyActionResult, SiteModel, companyMgtHelper, siteTypeMgtHelper, siteMgtHelper } from '@/models'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, BigintHelper, ArrayHelper, PaginationModel, AuthorityHelper, authorityHelper } from '@/0_tigersan_ui/tigerui'

// 选择框:
/** 筛选 */
const selectCompany = companyMgtHelper.GetIdNameSelectModel()
selectCompany._getItemsAsync = async () => await siteMgtHelper.GetBelongCompanyListAsync()
const selectType = siteTypeMgtHelper.GetIdNameSelectModel()
selectType._getItemsAsync = async () => await siteMgtHelper.GetBelongSiteTypeListAsync(selectCompany.Value.value?.id)
/** 表单 */
const selectCompanyForm = companyMgtHelper.GetIdNameSelectModel()
const selectTypeForm = siteTypeMgtHelper.GetIdNameSelectModel()
// 更新:
selectCompanyForm._onChange = selectTypeForm.UpdateItemsAsync

/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** “公司”项目配置 */
const configCompany: FormItemConfig<SiteModel, IdNameModel> = {
    _propName: 'company',
    PropText: '公司',
    IsEquired: true,
    Target: selectCompanyForm.Value,
    _getValue: source => selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
    _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, '不可为空')
}

/** “类型”项目配置 */
const configType: FormItemConfig<SiteModel, IdNameModel> = {
    _propName: 'type',
    PropText: '类型',
    IsEquired: true,
    Target: selectTypeForm.Value,
    _getValue: source => selectTypeForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.type)),
    _setValue: (source, propName, value) => source.type = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.type, 0n, '不可为空')
}

/** “名称”项目配置 */
const configName: FormItemConfig<SiteModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.name)
}

/** “地址”项目配置 */
const configAddr: FormItemConfig<SiteModel, string> = {
    _propName: 'addr',
    PropText: '地址',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.addr)
}

/** “详细地址”项目配置 */
const configAddrDetail: FormItemConfig<SiteModel, string> = {
    _propName: 'addrDetail',
    PropText: '详细地址',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.addrDetail)
}

/** “联系人”项目配置 */
const configManager: FormItemConfig<SiteModel, string> = {
    _propName: 'manager',
    PropText: '联系人',
    IsEquired: false,
    Target: ref(),
    // _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.manager)
}

/** “电话”项目配置 */
const configPhone: FormItemConfig<SiteModel, string> = {
    _propName: 'phone',
    PropText: '电话',
    IsEquired: false,
    Target: ref(),
    _isVerifyOk: source => Verify.IsValidPhoneNumber(source.phone)
}

/** “备注”项目配置 */
const configComment: FormItemConfig<SiteModel, string> = {
    _propName: 'comment',
    PropText: '备注',
    IsEquired: false,
    Target: ref(),
    // _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.comment)
}

/** “增”源数据获取方法 */
const AddGetSource = () => new SiteModel()

/** “场地管理”表单配置 */
let configSiteMgtForm: FormConfig<SiteModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        selectCompanyForm.IsEnabled.value = !isEdit
        selectTypeForm.IsEnabled.value = !isEdit

        await companyMgtHelper.UpdateIdNames()

        if (isEdit) {
            const rowData = siteMgtTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return
            }

            await selectCompanyForm.UpdateItemsAsync()
            selectCompanyForm.Value.value = companyMgtHelper.GetIdName(rowData.company)
            await selectTypeForm.UpdateItemsAsync()
            selectTypeForm.Value.value = siteTypeMgtHelper.GetIdName(rowData.type)
        } else {
        }
    },
    _itemConfigs: [
        configCompany,
        configType,
        configName,
        configAddr,
        configAddrDetail,
        configManager,
        configPhone,
        configComment,
    ]
}

/** “场地管理”表单模型 */
const siteMgtForm = new FormModel(configSiteMgtForm)

/** 查 */
async function Refresh() {
    await companyMgtHelper.UpdateIdNames()
    await siteTypeMgtHelper.UpdateIdNames()
    await selectCompany.UpdateItemsAsync()
    await selectType.UpdateItemsAsync()

    pagination.Count.value = await siteMgtHelper.GetCount({
        company: selectCompany.Value.value?.id,
        type: selectType.Value.value?.id
    })
    await siteMgtHelper.GetList({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
        company: selectCompany.Value.value?.id,
        type: selectType.Value.value?.id,
    }).then(arr => {
        ArrayHelper.Set(siteMgtTable.RowDatas, arr)
    })
}

pagination._onChange = Refresh
selectCompany._onChange = Refresh
selectType._onChange = Refresh

/** 增 */
async function Add() {
    siteMgtForm.Title.value = '新增场地'

    siteMgtForm._getSource = AddGetSource

    siteMgtForm._onSubmitAsync = async source => {
        const res = await siteMgtHelper.Add(source)

        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    siteMgtForm.Show()
}

/** 改 */
async function Edit() {
    siteMgtForm.Title.value = '修改场地'

    siteMgtForm._getSource = () => {
        const rowData = siteMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new SiteModel()
        }

        return ObjectHelper.ShallowCopy(rowData)
    }

    siteMgtForm._onSubmitAsync = async source => {
        const res = await siteMgtHelper.Edit(source)

        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    siteMgtForm.Show(true)
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

    const model = siteMgtTable.SelectedRowDatas.value[0]
    if (!model) {
        console.warn('The model is undefined!')
        return {}
    }

    siteMgtHelper.Delete(model.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export default {
    pagination,
    selectCompany,
    selectType,
    selectCompanyForm,
    selectTypeForm,
    configCompany,
    configType,
    configName,
    configAddr,
    configAddrDetail,
    configManager,
    configPhone,
    configComment,
    siteMgtForm,
    Refresh,
    Add,
    Edit,
    Delete,
}