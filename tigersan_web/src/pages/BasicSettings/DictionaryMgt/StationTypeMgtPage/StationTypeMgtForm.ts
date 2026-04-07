import { ref } from 'vue'
import { stationTypeMgtTable } from './StationTypeMgtTable'
import { GetSubmitResult, MyActionResult, StationTypeModel, stationTypeMgtHelper } from '@/models'
import { Colors, dialog, Verify, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, ArrayHelper, PaginationModel } from '@/0_tigersan_ui/tigerui'

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** “名称”项目配置 */
const configName: FormItemConfig<StationTypeModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.name)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => new StationTypeModel()

/** “基站类型”表单配置 */
let configStationTypeMgtForm: FormConfig<StationTypeModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
    },
    _itemConfigs: [
        configName,
    ]
}

/** “基站类型”表单模型 */
const stationTypeMgtForm = new FormModel(configStationTypeMgtForm)

/** 查 */
async function Refresh() {
    pagination.Count.value = await stationTypeMgtHelper.GetCount({})
    await stationTypeMgtHelper.GetList({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
    }).then(arr => {
        ArrayHelper.Set(stationTypeMgtTable.RowDatas, arr)
    })
}

pagination._onChange = Refresh

/** 增 */
async function Add() {
    stationTypeMgtForm.Title.value = '新增基站类型'

    stationTypeMgtForm._getSource = AddGetSource

    stationTypeMgtForm._onSubmitAsync = async source => {
        const res = await stationTypeMgtHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    stationTypeMgtForm.Show()
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

    const model = stationTypeMgtTable.SelectedRowDatas.value[0]
    if (!model) {
        console.warn('The model is undefined!')
        return {}
    }

    stationTypeMgtHelper.Delete(model.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export default {
    pagination,
    configName,
    stationTypeMgtForm,
    Refresh,
    Add,
    Delete,
}