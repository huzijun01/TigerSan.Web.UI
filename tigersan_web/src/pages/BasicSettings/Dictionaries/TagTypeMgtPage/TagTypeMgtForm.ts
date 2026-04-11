import { ref } from 'vue'
import { Colors, dialog, Verify, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, ArrayHelper, PaginationModel, ObjectHelper, GetSubmitResult, MyActionResult } from '@/0_tigersan_ui/tigerui'
import { tagTypeMgtTable } from './TagTypeMgtTable'
import { TagTypeModel, tagTypeMgtHelper } from '@/models'

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** “名称”项目配置 */
const configName: FormItemConfig<TagTypeModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.name)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => new TagTypeModel()

/** “标签类型”表单配置 */
let configTagTypeMgtForm: FormConfig<TagTypeModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
    },
    _itemConfigs: [
        configName,
    ]
}

/** “标签类型”表单模型 */
const tagTypeMgtForm = new FormModel(configTagTypeMgtForm)

/** 查 */
async function Refresh() {
    pagination.Count.value = await tagTypeMgtHelper.GetCount({})
    await tagTypeMgtHelper.GetList({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
    }).then(arr => {
        ArrayHelper.Set(tagTypeMgtTable.RowDatas, arr)
    })
}

pagination._onChange = Refresh

/** 增 */
async function Add() {
    tagTypeMgtForm.Title.value = '新增标签类型'

    tagTypeMgtForm._getSource = AddGetSource

    tagTypeMgtForm._onSubmitAsync = async source => {
        const res = await tagTypeMgtHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    tagTypeMgtForm.Show()
}

/** 改 */
async function Edit() {
    tagTypeMgtForm.Title.value = '修改部门'

    tagTypeMgtForm._getSource = () => {
        const rowData = tagTypeMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new TagTypeModel()
        }

        return ObjectHelper.ShallowCopy(rowData)
    }

    tagTypeMgtForm._onSubmitAsync = async source => {
        const res = await tagTypeMgtHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    tagTypeMgtForm.Show()
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

    const model = tagTypeMgtTable.SelectedRowDatas.value[0]
    if (!model) {
        console.warn('The model is undefined!')
        return {}
    }

    tagTypeMgtHelper.Delete(model.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export default {
    pagination,
    configName,
    tagTypeMgtForm,
    Refresh,
    Add,
    Edit,
    Delete,
}