import { ref } from 'vue'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, BigintHelper, ArrayHelper, PaginationModel, GetSubmitResult, IdNameModel, MyActionResult, loading, MapModel, PolygonEditorEvent } from '@/0_tigersan_ui/tigerui'
import { siteMgtTable } from './SiteMgtTable'
import { companyHelper, siteHelper, siteTypeHelper, SiteModel } from '@/models'

// 选择框:
/** 筛选 */
const selectCompany = companyHelper.GetIdNameSelectModel()
selectCompany._getItemsAsync = async () => await siteHelper.GetBelongCompanyListAsync()
const selectType = siteTypeHelper.GetIdNameSelectModel()
selectType._getItemsAsync = async () => await siteHelper.GetBelongSiteTypeListAsync(selectCompany.Value.value?.id)
/** 表单 */
const selectCompanyForm = companyHelper.GetIdNameSelectModel()
const selectTypeForm = siteTypeHelper.GetIdNameSelectModel()
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

/** “场地”表单配置 */
let configSiteMgtForm: FormConfig<SiteModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        selectCompanyForm.IsEnabled.value = !isEdit
        selectTypeForm.IsEnabled.value = !isEdit

        if (isEdit) {
            const rowData = siteMgtTable.SelectedRowDatas.value[0]
            if (!rowData) {
                console.warn('The rowData is undefined!')
                return
            }

            await selectCompanyForm.UpdateItemsAsync()
            selectCompanyForm.Value.value = companyHelper.GetIdName(rowData.company)
            await selectTypeForm.UpdateItemsAsync()
            selectTypeForm.Value.value = siteTypeHelper.GetIdName(rowData.type)
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

/** “场地”表单模型 */
const siteForm = new FormModel(configSiteMgtForm)
siteForm.MinWidth.value = '80vw'
siteForm.MinHeight.value = '80vh'
siteForm.FillOpts.value = { right: true }

/** 查 */
async function Refresh() {
    try {
        loading.IsShow.value = true

        await companyHelper.UpdateIdNames()
        await siteTypeHelper.UpdateIdNames()
        await selectCompany.UpdateItemsAsync()
        await selectType.UpdateItemsAsync()

        pagination.Count.value = await siteHelper.GetCount({
            company: selectCompany.Value.value?.id,
            type: selectType.Value.value?.id
        })

        await siteHelper.GetList({
            pageSize: pagination.PageSize.value,
            pageNumber: pagination.SelectedNum.value,
            company: selectCompany.Value.value?.id,
            type: selectType.Value.value?.id,
        }).then(arr => {
            ArrayHelper.Set(siteMgtTable.RowDatas, arr)
        })
    } finally {
        loading.IsShow.value = false
    }
}

pagination._onChange = Refresh
selectCompany._onChange = Refresh
selectType._onChange = Refresh

/** 增 */
async function Add() {
    siteForm.Title.value = '新增场地'

    siteForm._getSource = AddGetSource

    siteForm._onSubmitAsync = async source => {
        const res = await siteHelper.Add(source)

        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    siteForm.Show()
}

/** 改 */
async function Edit() {
    siteForm.Title.value = '修改场地'

    siteForm._getSource = () => {
        const rowData = siteMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new SiteModel()
        }

        return ObjectHelper.ShallowCopy(rowData)
    }

    siteForm._onSubmitAsync = async source => {
        const res = await siteHelper.Edit(source)

        map._polygonEditor?.close()
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    siteForm.Show(true)
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

async function DeleteRowData(state: DialogState) {
    if (state != DialogState.Yes) return

    const model = siteMgtTable.SelectedRowDatas.value[0]
    if (!model) {
        console.warn('The model is undefined!')
        return {}
    }

    try {
        loading.IsShow.value = true

        await siteHelper.Delete(model.id).then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
    } finally {
        loading.IsShow.value = false
    }
}

export const siteMgtForm = {
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
    siteForm,
    Refresh,
    Add,
    Edit,
    Delete,
}

/** 地图 */
export const map = new MapModel<any>()

map._onInitAsync = async () => {
    await companyHelper.UpdateIdNames()

    const editor = await map.GetPolygonEditorAsync()
    if (!editor) {
        console.warn('The editor is undefined!')
        return
    }

    const path1: AMap.Vector2[] = [[116.475334, 39.997534], [116.476627, 39.998315], [116.478603, 39.99879], [116.478529, 40.000296], [116.475082, 40.000151], [116.473421, 39.998717]]
    const path2: AMap.Vector2[] = [[116.474595, 40.001321], [116.473526, 39.999865], [116.476284, 40.000917]]
    const polygon1 = new AMap.Polygon({
        path: path1
    })
    const polygon2 = new AMap.Polygon({
        path: path2
    })

    editor.addAdsorbPolygons([polygon1, polygon2])
    map._map?.add(polygon1)
    map._map?.add(polygon2)
    map.ZoomByMultiVector2s([path1, path2])
    editor.close()
    editor.setTarget(polygon2)
    editor.open()

    editor.on(PolygonEditorEvent.adjust, (args: AMap.PolygonEditorArgs) => {
        console.log(args.target.getPath())

    })

    editor.on(PolygonEditorEvent.end, (args: AMap.PolygonEditorEndArgs) => {
        console.log(args.target.getPath())

    })
}