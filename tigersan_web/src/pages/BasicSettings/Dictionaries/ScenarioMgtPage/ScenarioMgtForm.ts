import { ref } from 'vue'
import { Colors, dialog, Verify, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, ArrayHelper, PaginationModel, ObjectHelper, GetSubmitResult, MyActionResult } from '@/0_tigersan_ui/tigerui'
import { scenarioMgtTable } from './ScenarioMgtTable'
import { ScenarioModel, scenarioMgtHelper } from '@/models'

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** “名称”项目配置 */
const configName: FormItemConfig<ScenarioModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.name)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => new ScenarioModel()

/** “场景”表单配置 */
let configScenarioMgtForm: FormConfig<ScenarioModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
    },
    _itemConfigs: [
        configName,
    ]
}

/** “场景”表单模型 */
const scenarioMgtForm = new FormModel(configScenarioMgtForm)

/** 查 */
async function Refresh() {
    pagination.Count.value = await scenarioMgtHelper.GetCount({})
    await scenarioMgtHelper.GetList({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
    }).then(arr => {
        ArrayHelper.Set(scenarioMgtTable.RowDatas, arr)
    })
}

pagination._onChange = Refresh

/** 增 */
async function Add() {
    scenarioMgtForm.Title.value = '新增场景'

    scenarioMgtForm._getSource = AddGetSource

    scenarioMgtForm._onSubmitAsync = async source => {
        const res = await scenarioMgtHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    scenarioMgtForm.Show()
}

/** 改 */
async function Edit() {
    scenarioMgtForm.Title.value = '修改部门'

    scenarioMgtForm._getSource = () => {
        const rowData = scenarioMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new ScenarioModel()
        }

        return ObjectHelper.ShallowCopy(rowData)
    }

    scenarioMgtForm._onSubmitAsync = async source => {
        const res = await scenarioMgtHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    scenarioMgtForm.Show()
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

    const model = scenarioMgtTable.SelectedRowDatas.value[0]
    if (!model) {
        console.warn('The model is undefined!')
        return {}
    }

    scenarioMgtHelper.Delete(model.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export default {
    pagination,
    configName,
    scenarioMgtForm,
    Refresh,
    Add,
    Edit,
    Delete,
}