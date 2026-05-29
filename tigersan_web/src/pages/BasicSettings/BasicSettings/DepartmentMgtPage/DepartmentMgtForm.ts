import { ref } from 'vue'
import { Colors, DialogHelper, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, BigintHelper, ArrayHelper, PaginationModel, GetSubmitResult, IdNameModel, MyActionResult, loading } from '@/0_tigersan_ui/tigerui'
import { departmentMgtTable } from './DepartmentMgtTable'
import { companyHelper, departmentHelper, DepartmentModel } from '@/models'

export class DepartmentMgtForm {
    //#region 【Fields】
    /** 筛选 */
    readonly selectCompany = companyHelper.GetIdNameSelectModel()
    /** 表单 */
    readonly selectCompanyForm = companyHelper.GetIdNameSelectModel()
    /** 分页器 */
    readonly pagination = new PaginationModel()

    /** “公司”项目配置 */
    readonly configCompany: FormItemConfig<DepartmentModel, IdNameModel> = {
        _propName: 'company',
        PropText: '公司',
        IsEquired: true,
        Target: this.selectCompanyForm.Value,
        _getValue: source => this.selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
        _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, '不可为空')
    }

    /** “名称”项目配置 */
    readonly configName: FormItemConfig<DepartmentModel, string> = {
        _propName: 'name',
        PropText: '名称',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => {
            return Verify.IsNotUndefinedOrEmpty(source.name)
        }
    }

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => new DepartmentModel()

    /** “部门”表单配置 */
    readonly configDepartmentMgtForm: FormConfig<DepartmentModel> = {
        CancelText: '取消',
        SubmitText: '确定',
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
            await companyHelper.UpdateIdNames()
            await this.selectCompanyForm.UpdateItemsAsync()
        },
        _itemConfigs: [
            this.configCompany,
            this.configName,
        ]
    }

    /** “部门”表单模型 */
    readonly departmentForm = new FormModel(this.configDepartmentMgtForm)
    //#endregion 【Fields】

    //#region 【Ctor】
    constructor() {
        this.pagination.IsShowSelectedRowCount.value = true
        this.pagination._onChange = this.Refresh
        this.selectCompany._onChange = this.Refresh
        this.selectCompany._getItemsAsync = async () => await departmentHelper.GetBelongCompanyListAsync()
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            await companyHelper.UpdateIdNames()
            await this.selectCompany.UpdateItemsAsync()

            this.pagination.Count.value = await departmentHelper.GetCount({
                company: this.selectCompany.Value.value?.id
            })

            await departmentHelper.GetList({
                pageSize: this.pagination.PageSize.value,
                pageNumber: this.pagination.SelectedNum.value,
                company: this.selectCompany.Value.value?.id,
            }).then(arr => {
                ArrayHelper.Set(departmentMgtTable.RowDatas, arr)
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 增 */
    readonly Add = async () => {
        this.departmentForm.Title.value = '新增部门'

        this.departmentForm._getSource = this.AddGetSource

        this.departmentForm._onSubmitAsync = async source => {
            const res = await departmentHelper.Add(source)
            await this.Refresh()
            return GetSubmitResult(res, '添加成功')
        }

        this.departmentForm.Show()
    }

    /** 改 */
    readonly Edit = async () => {
        this.departmentForm.Title.value = '修改部门'

        this.departmentForm._getSource = () => {
            const rowData = departmentMgtTable.SelectedRowDatas.value[0]

            if (!rowData) {
                console.warn('The rowData is undefined!')
                return new DepartmentModel()
            }

            return ObjectHelper.ShallowCopy(rowData)
        }

        this.departmentForm._onSubmitAsync = async source => {
            const res = await departmentHelper.Edit(source)
            await this.Refresh()
            return GetSubmitResult(res, '修改成功')
        }

        this.departmentForm.Show()
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

        const rowData = departmentMgtTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return {}
        }

        try {
            loading.IsShow.value = true

            await departmentHelper.Delete(rowData.id).then(res => {
                this.Refresh()
                MyActionResult.ShowResult(res, '删除成功')
            })
        } finally {
            loading.IsShow.value = false
        }
    }
    //#endregion 【Functions】
}