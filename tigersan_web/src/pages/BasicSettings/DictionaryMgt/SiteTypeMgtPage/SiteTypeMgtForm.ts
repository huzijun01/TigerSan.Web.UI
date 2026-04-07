import { ref } from 'vue'
import { siteTypeMgtTable } from './SiteTypeMgtTable'
import { GetSubmitResult, MyActionResult, SiteTypeModel, siteTypeMgtHelper } from '@/models'
import { Colors, dialog, Verify, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, ArrayHelper, PaginationModel } from '@/0_tigersan_ui/tigerui'

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** “名称”项目配置 */
const configName: FormItemConfig<SiteTypeModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.name)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => new SiteTypeModel()

/** “场地类型”表单配置 */
let configSiteTypeMgtForm: FormConfig<SiteTypeModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
    },
    _itemConfigs: [
        configName,
    ]
}

/** “场地类型”表单模型 */
const siteTypeMgtForm = new FormModel(configSiteTypeMgtForm)

/** 查 */
async function Refresh() {
    pagination.Count.value = await siteTypeMgtHelper.GetCount({})
    await siteTypeMgtHelper.GetList({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
    }).then(arr => {
        ArrayHelper.Set(siteTypeMgtTable.RowDatas, arr)
    })
}

pagination._onChange = Refresh

/** 增 */
async function Add() {
    siteTypeMgtForm.Title.value = '新增场地类型'

    siteTypeMgtForm._getSource = AddGetSource

    siteTypeMgtForm._onSubmitAsync = async source => {
        const res = await siteTypeMgtHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    siteTypeMgtForm.Show()
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

    const model = siteTypeMgtTable.SelectedRowDatas.value[0]
    if (!model) {
        console.warn('The model is undefined!')
        return {}
    }

    siteTypeMgtHelper.Delete(model.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export default {
    pagination,
    configName,
    siteTypeMgtForm,
    Refresh,
    Add,
    Delete,
}