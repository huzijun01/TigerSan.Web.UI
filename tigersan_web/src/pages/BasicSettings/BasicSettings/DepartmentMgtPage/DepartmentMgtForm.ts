import { ref } from 'vue'
import { departmentMgtTable } from './DepartmentMgtTable'
import { GetSubmitResult, MyActionResult, DepartmentModel, companyMgtHelper, departmentMgtHelper, IdNameModel } from '@/models'
import { Colors, dialog, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, BigintHelper, ArrayHelper, PaginationModel } from '@/0_tigersan_ui/tigerui'

// 选择框:
/** 筛选 */
const selectCompany = companyMgtHelper.GetIdNameSelectModel()
selectCompany._getItemsAsync = async () => await departmentMgtHelper.GetBelongCompanyListAsync()
/** 表单 */
const selectCompanyForm = companyMgtHelper.GetIdNameSelectModel()

// 字段:
/** 分页器 */
const pagination = new PaginationModel()
pagination.IsShowSelectedRowCount.value = true

/** “公司”项目配置 */
const configCompany: FormItemConfig<DepartmentModel, IdNameModel> = {
    _propName: 'company',
    PropText: '公司',
    IsEquired: true,
    Target: selectCompanyForm.Value,
    _getValue: source => selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
    _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
    _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, '不可为空')
}

/** “名称”项目配置 */
const configName: FormItemConfig<DepartmentModel, string> = {
    _propName: 'name',
    PropText: '名称',
    IsEquired: true,
    Target: ref(),
    _isVerifyOk: source => {
        return Verify.IsNotUndefinedOrEmpty(source.name)
    }
}

/** “增”源数据获取方法 */
const AddGetSource = () => new DepartmentModel()

/** “部门管理”表单配置 */
let configDepartmentMgtForm: FormConfig<DepartmentModel> = {
    CancelText: '取消',
    SubmitText: '确定',
    _getSource: AddGetSource,
    _beforeInitAsync: async isEdit => {
        await companyMgtHelper.UpdateIdNames()
        await selectCompanyForm.UpdateItemsAsync()
    },
    _itemConfigs: [
        configCompany,
        configName,
    ]
}

/** “部门管理”表单模型 */
const departmentMgtForm = new FormModel(configDepartmentMgtForm)

/** 查 */
async function Refresh() {
    await companyMgtHelper.UpdateIdNames()
    await selectCompany.UpdateItemsAsync()
    pagination.Count.value = await departmentMgtHelper.GetCount({
        company: selectCompany.Value.value?.id
    })
    await departmentMgtHelper.GetList({
        pageSize: pagination.PageSize.value,
        pageNumber: pagination.SelectedNum.value,
        company: selectCompany.Value.value?.id,
    }).then(arr => {
        ArrayHelper.Set(departmentMgtTable.RowDatas, arr)
    })
}

pagination._onChange = Refresh
selectCompany._onChange = Refresh

/** 增 */
async function Add() {
    departmentMgtForm.Title.value = '新增部门'

    departmentMgtForm._getSource = AddGetSource

    departmentMgtForm._onSubmitAsync = async source => {
        const res = await departmentMgtHelper.Add(source)
        await Refresh()
        return GetSubmitResult(res, '添加成功')
    }

    departmentMgtForm.Show()
}

/** 改 */
async function Edit() {
    departmentMgtForm.Title.value = '修改部门'

    departmentMgtForm._getSource = () => {
        const rowData = departmentMgtTable.SelectedRowDatas.value[0]

        if (!rowData) {
            console.warn('The rowData is undefined!')
            return new DepartmentModel()
        }

        return ObjectHelper.ShallowCopy(rowData)
    }

    departmentMgtForm._onSubmitAsync = async source => {
        const res = await departmentMgtHelper.Edit(source)
        await Refresh()
        return GetSubmitResult(res, '修改成功')
    }

    departmentMgtForm.Show()
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

    const rowData = departmentMgtTable.SelectedRowDatas.value[0]
    if (!rowData) {
        console.warn('The rowData is undefined!')
        return {}
    }

    departmentMgtHelper.Delete(rowData.id)
        .then(res => {
            Refresh()
            MyActionResult.ShowResult(res, '删除成功')
        })
}

export default {
    selectCompanyForm,
    pagination,
    selectCompany,
    configCompany,
    configName,
    departmentMgtForm,
    Refresh,
    Add,
    Edit,
    Delete,
}