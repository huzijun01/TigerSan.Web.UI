import { ref } from 'vue'
import { Colors } from '../base'
import { DialogHelper } from '../stores'
import { IdNameModel } from './SelectModel'
import { FormModel } from './Form/FormModel'
import { loading } from './Dialog/LoadingModel'
import { ItemType, TableModel } from './Table/TableModel'
import { DialogMode, DialogState } from './DialogModel'
import { PaginationModel } from './Pagination/PaginationModel'
import { FormConfig, FormItemConfig } from './Form/FormConfig'
import { GetSubmitResult, MyActionResult } from './MyActionResult'
import { ArrayHelper, DictionaryHelper, ObjectHelper, Verify } from '../helpers'

export class DictionaryModel {
    /** 名称 */
    readonly _name: string

    /** 帮助类实例 */
    readonly _helper: DictionaryHelper

    /** 分页器 */
    readonly pagination = new PaginationModel()

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => new IdNameModel()

    /** “名称”项目配置 */
    readonly configName: FormItemConfig<IdNameModel, string> = {
        _propName: 'name',
        PropText: '名称',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => {
            return Verify.IsNotUndefinedOrEmpty(source.name)
        }
    }

    /** 表单配置 */
    readonly configForm: FormConfig<IdNameModel> = {
        CancelText: '取消',
        SubmitText: '确定',
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
        },
        _itemConfigs: [
            this.configName,
        ]
    }

    /** 表单模型 */
    readonly form = new FormModel(this.configForm)

    /** 表格模型 */
    readonly table = new TableModel<IdNameModel>([
        {
            _propName: 'name',
            Text: '名称',
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
    ])

    constructor(name: string, helper: DictionaryHelper) {
        this._name = name
        this._helper = helper
        this.table.IsAllowMultiSelect.value = false
        this.pagination.IsShowSelectedRowCount.value = true
        this.pagination._onChange = this.Refresh
    }

    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            this.pagination.Count.value = await this._helper.GetCount({})
            await this._helper.GetList({
                pageSize: this.pagination.PageSize.value,
                pageNumber: this.pagination.SelectedNum.value,
            }).then(arr => {
                ArrayHelper.Set(this.table.RowDatas, arr)
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 增 */
    readonly Add = async () => {
        this.form.Title.value = `新增${this._name}`

        this.form._getSource = this.AddGetSource

        this.form._onSubmitAsync = async source => {
            const res = await this._helper.Add(source)
            await this.Refresh()
            return GetSubmitResult(res, '添加成功')
        }

        this.form.Show()
    }


    /** 改 */
    readonly Edit = async () => {
        this.form.Title.value = `修改${this._name}`

        this.form._getSource = () => {
            const rowData = this.table.SelectedRowDatas.value[0]

            if (!rowData) {
                console.warn('The rowData is undefined!')
                return new IdNameModel()
            }

            return ObjectHelper.ShallowCopy(rowData)
        }

        this.form._onSubmitAsync = async source => {
            const res = await this._helper.Edit(source)
            await this.Refresh()
            return GetSubmitResult(res, '修改成功')
        }

        this.form.Show()
    }

    /** 删 */
    readonly Delete = async () => {
        DialogHelper.ShowDialog(
            '确认',
            '是否确定删除？',
            undefined,
            this.DeleteRowData,
            DialogMode.YesOrNo,
            Colors.Warning)
    }

    readonly DeleteRowData = async (state: DialogState) => {
        if (state != DialogState.Yes) return

        const model = this.table.SelectedRowDatas.value[0]
        if (!model) {
            console.warn('The model is undefined!')
            return {}
        }

        this._helper.Delete(model.id).then(res => {
            this.Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
    }
}
