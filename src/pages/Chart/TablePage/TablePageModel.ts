import { ref } from 'vue'
import { Colors, DialogHelper, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, DatePickerModel, PaginationModel, GetSubmitResult, ApiResult, loading, Texts, TextModel, Gender } from '../../../packages'
import { personTable } from './TableModel'
import { PersonHelper, PersonModel } from './PersonModel'

export class PersonForm {
    //#region 【Fields】
    /** 分页器 */
    readonly pagination = new PaginationModel()
    /** “性别”选择框 */
    readonly selectGender = Gender.GetSelectModel()
    /** “性别”选择框 */
    readonly selectGenderForm = Gender.GetSelectModel()
    /** 加入时间 */
    readonly joiningTime = new DatePickerModel()

    /** “ID”项目配置 */
    readonly configId: FormItemConfig<PersonModel, bigint> = {
        _propName: 'id',
        PropText: 'ID',
        IsEquired: true,
        Target: ref(),
        _setValue: (obj, propName, value) => obj.id = BigInt(value ?? 0n),
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.id),
    }

    /** “名称”项目配置 */
    readonly configName: FormItemConfig<PersonModel, string> = {
        _propName: 'name',
        PropText: Texts.Name,
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.name),
    }

    /** “年龄”项目配置 */
    readonly configAge: FormItemConfig<PersonModel, number> = {
        _propName: 'age',
        PropText: Texts.Age,
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsGreaterThan(source.age),
    }

    /** “性别”项目配置 */
    readonly configGender: FormItemConfig<PersonModel, boolean> = {
        _propName: 'gender',
        PropText: Texts.Gender,
        IsEquired: true,
        Target: this.selectGenderForm.Value,
        _isVerifyOk: source => Verify.IsNotUndefined(source.gender),
    }

    /** “薪资”项目配置 */
    readonly configSalary: FormItemConfig<PersonModel, string> = {
        _propName: 'salary',
        PropText: Texts.Salary,
        IsEquired: true,
        Target: ref(),
        _setValue: (obj, propName, value) => obj.salary = Number(value ?? 0),
        _isVerifyOk: source => Verify.IsGreaterThan(source.salary),
    }

    /** “加入时间”项目配置 */
    readonly configJoiningTime: FormItemConfig<PersonModel, string | [string, string] | undefined> = {
        _propName: 'joiningTime',
        PropText: Texts.JoiningTime,
        IsEquired: true,
        Target: this.joiningTime.Date,
        _isVerifyOk: source => Verify.IsNotUndefined(source.joiningTime),
    }

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => new PersonModel()

    /** “人员”表单配置 */
    readonly configPersonForm: FormConfig<PersonModel> = {
        _getSource: this.AddGetSource,
        _itemConfigs: [
            this.configId,
            this.configName,
            this.configAge,
            this.configGender,
            this.configSalary,
            this.configJoiningTime,
        ]
    }

    /** “人员”表单模型 */
    readonly personForm = new FormModel(this.configPersonForm)
    //#endregion 【Fields】

    //#region 【Properties】
    /** “ID”是否只读 */
    readonly IsIdReadonly = ref(false)
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor() {
        this.joiningTime.Width.value = '208px'
        this.joiningTime.IsShowPrefix.value = false
        this.selectGenderForm.Width.value = 208
        this.pagination.IsShowSelectedRowCount.value = true
        personTable._onSlotChange = this.Refresh
        this.pagination._onChange = this.Refresh
        this.selectGender._onChange = this.Refresh
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            const arr = PersonHelper.GetList(
                this.selectGender.Value.value,
                personTable.SlotHeader.value?._propName,
                personTable.IsAscending.value)
            personTable.SetRowDatas(this.pagination.GetPage(arr))
            if (this.pagination.Count.value != arr.length) {
                this.pagination.Count.value = arr.length
            }
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 增 */
    readonly Add = () => {
        this.personForm.Title.value = TextModel.GetText('Add Person', '新增人员')

        this.IsIdReadonly.value = false
        this.personForm._getSource = this.AddGetSource

        this.personForm._onSubmit = source => {
            const res = PersonHelper.Add(source)
            this.Refresh()
            return GetSubmitResult(res, Texts.AddedSuccessfully.value)
        }

        this.personForm.Show()
    }

    /** 改 */
    readonly Edit = () => {
        this.personForm.Title.value = TextModel.GetText('Edit Person', '修改人员')

        this.IsIdReadonly.value = true
        this.personForm._getSource = () => {
            const rowData = personTable.SelectedRowDatas.value[0]

            if (!rowData) {
                console.warn('The rowData is undefined!')
                return new PersonModel()
            }

            return ObjectHelper.ShallowCopy(rowData)
        }

        this.personForm._onSubmit = source => {
            const res = PersonHelper.Edit(source)
            this.Refresh()
            return GetSubmitResult(res, Texts.EditedSuccessfully.value)
        }

        this.personForm.Show()
    }

    /** 删 */
    readonly Delete = () => {
        DialogHelper.Show(
            Texts.Confirm,
            Texts.DeleteConfirm.value,
            undefined,
            this.DeleteRowData,
            DialogMode.YesOrNo,
            Colors.Warning)
    }

    readonly DeleteRowData = (state: DialogState) => {
        if (state != DialogState.Yes) return

        const rowData = personTable.SelectedRowDatas.value[0]
        if (!rowData) {
            console.warn('The rowData is undefined!')
            return
        }

        try {
            loading.IsShow.value = true

            const res = PersonHelper.Delete(rowData.id)
            this.Refresh()
            ApiResult.ShowResult(res, Texts.DeletedSuccessfully.value)
        } finally {
            loading.IsShow.value = false
        }
    }
    //#endregion 【Functions】
}