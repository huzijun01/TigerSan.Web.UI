import { ref } from 'vue'
import { Colors, DialogHelper, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, ArrayHelper, PaginationModel, GetSubmitResult, IdNameModel, MyActionResult, loading, Texts } from '@/0_tigersan_ui/tigerui'
import { GetTableModel } from './BindingRecordTable'
import { bindingRecordHelper, BindingRecordModel } from '@/models'

export class BindingRecordPageModel {
    //#region 【Fields】
    _tag?: bigint
    _asset?: bigint
    /** 分页器 */
    readonly pagination = new PaginationModel()

    /** “公司”项目配置 */
    readonly configTagId: FormItemConfig<BindingRecordModel, IdNameModel> = {
        _propName: 'tagId',
        PropTextEN: 'TagId',
        PropTextCH: '标签',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => {
            return Verify.IsNotUndefinedOrEmpty(source.tagId)
        }
    }

    /** “名称”项目配置 */
    readonly configAssetId: FormItemConfig<BindingRecordModel, string> = {
        _propName: 'assetId',
        PropTextEN: 'AssetId',
        PropTextCH: '资产',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => {
            return Verify.IsNotUndefinedOrEmpty(source.assetId)
        }
    }

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => new BindingRecordModel()

    /** 表单配置 */
    readonly configBindingRecordPageModel: FormConfig<BindingRecordModel> = {
        CancelText: Texts.Cancel.value,
        SubmitText: Texts.Ok.value,
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
        },
        _itemConfigs: [
            this.configTagId,
            this.configAssetId,
        ]
    }

    /** 表单模型 */
    readonly form = new FormModel(this.configBindingRecordPageModel)

    /** 表格 */
    readonly table = GetTableModel()
    //#endregion 【Fields】

    //#region 【Ctor】
    constructor() {
        this.table.IsAllowMultiSelect.value = false
        this.pagination.IsShowSelectedRowCount.value = true
        this.pagination._onChange = this.Refresh
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            if (!this._tag && !this._asset) {
                console.warn('The _tag and _asset is undefined!')
                return
            }

            this.pagination.Count.value = await bindingRecordHelper.GetCount({
                tag: this._tag,
                asset: this._asset,
            })

            await bindingRecordHelper.GetList({
                pageSize: this.pagination.PageSize.value,
                pageNumber: this.pagination.SelectedNum.value,
                tag: this._tag,
                asset: this._asset,
            }).then(arr => {
                ArrayHelper.Set(this.table.RowDatas, arr)
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 增 */
    readonly Add = async () => {
        this.form.Title.value = '新增部门'

        this.form._getSource = this.AddGetSource

        this.form._onSubmitAsync = async source => {
            const res = await bindingRecordHelper.Add(source)
            await this.Refresh()
            return GetSubmitResult(res, '添加成功')
        }

        this.form.Show()
    }

    /** 改 */
    readonly Edit = async () => {
        this.form.Title.value = '修改部门'

        this.form._getSource = () => {
            const rowData = this.table.SelectedRowDatas.value[0]

            if (!rowData) {
                console.warn('The rowData is undefined!')
                return new BindingRecordModel()
            }

            return ObjectHelper.ShallowCopy(rowData)
        }

        this.form._onSubmitAsync = async source => {
            const res = await bindingRecordHelper.Edit(source)
            await this.Refresh()
            return GetSubmitResult(res, '修改成功')
        }

        this.form.Show()
    }

    /** 删 */
    readonly Delete = () => {
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

        const rows = this.table.SelectedRowDatas.value.map(i => i.id)
        if (rows.length < 1) {
            console.warn('No row was selected!')
            return
        }

        try {
            loading.IsShow.value = true

            await bindingRecordHelper.DeleteRange(rows).then(res => {
                this.Refresh()
                MyActionResult.ShowResult(res, '删除成功')
            })
        } finally {
            loading.IsShow.value = false
        }
    }
    //#endregion 【Functions】
}