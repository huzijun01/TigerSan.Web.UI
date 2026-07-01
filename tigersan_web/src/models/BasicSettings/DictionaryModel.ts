import { ref } from 'vue'
import { PaginationModel, IdNameModel, FormItemConfig, Verify, FormConfig, FormModel, TableModel, ItemType, loading, ArrayHelper, GetSubmitResult, ObjectHelper, DialogHelper, DialogMode, Colors, DialogState, MyActionResult, BigintHelper, Texts } from '@/0_tigersan_ui/tigerui'
import { DictionaryHelper } from '@/helpers'
import { companyHelper } from './CompanyModel'

export class DictionaryModel {
    /** 名称 */
    readonly _name: string
    /** 帮助类实例 */
    readonly _helper: DictionaryHelper
    /** 是否“显示公司” */
    readonly _isShowCompany: boolean
    /** “公司”选择（筛选） */
    readonly selectCompany = companyHelper.GetIdNameSelectModel()
    /** “公司”选择（表单） */
    readonly selectCompanyForm = companyHelper.GetIdNameSelectModel()

    /** 分页器 */
    readonly pagination = new PaginationModel()

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => new IdNameModel()

    /** “名称”项目配置 */
    readonly configName: FormItemConfig<IdNameModel, string> = {
        _propName: 'name',
        PropTextEN: 'Name',
        PropTextCH: '名称',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => {
            return Verify.IsNotUndefinedOrEmpty(source.name)
        }
    }

    /** “公司”项目配置 */
    readonly configCompany: FormItemConfig<IdNameModel, IdNameModel> = {
        _propName: 'companyName',
        PropTextEN: 'Company',
        PropTextCH: '公司',
        IsEquired: true,
        Target: this.selectCompanyForm.Value,
        _getValue: async (obj, propName) => this.selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, obj.company)),
        _setValue: (obj, propName, value) => {
            obj.company = value ? value.id : undefined
        }
    }

    /** 表单配置 */
    readonly configForm: FormConfig<IdNameModel> = {
        CancelText: Texts.Cancel.value,
        SubmitText: Texts.Ok.value,
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
            if (this._isShowCompany) {
                await companyHelper.UpdateIdNames()
                await this.selectCompanyForm.UpdateItemsAsync()
            }
        },
        _itemConfigs: [
            this.configName,
        ]
    }

    /** 表单模型 */
    readonly form: FormModel<IdNameModel>

    /** 表格模型 */
    readonly table = new TableModel<IdNameModel>([
        {
            _propName: 'name',
            Text: '名称',
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
    ])

    constructor(
        name: string,
        helper: DictionaryHelper,
        isShowCompany: boolean = false) {
        this._name = name
        this._helper = helper
        this._isShowCompany = isShowCompany
        this.table.IsAllowMultiSelect.value = false
        this.pagination.IsShowSelectedRowCount.value = true
        this.pagination._onChange = this.Refresh
        this.selectCompany._onChange = this.Refresh
        if (isShowCompany) {
            this.table._headerConfigs.unshift({
                _propName: 'companyName',
                Text: '公司',
                IsReadonly: true,
                Type: ItemType.TextBox,
            })
            this.configForm._itemConfigs?.unshift(this.configCompany)
        }

        this.form = new FormModel(this.configForm)
    }

    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            if (this._isShowCompany) {
                await companyHelper.UpdateIdNames()
                await this.selectCompany.UpdateItemsAsync()
            }

            this.pagination.Count.value = await this._helper.GetCount({
                company: this.selectCompany.Value.value?.id
            })
            await this._helper.GetList({
                pageSize: this.pagination.PageSize.value,
                pageNumber: this.pagination.SelectedNum.value,
                company: this.selectCompany.Value.value?.id
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
            return GetSubmitResult(res, Texts.AddedSuccessfully.value)
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
            return
        }

        this._helper.Delete(model.id).then(res => {
            this.Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
    }
}
