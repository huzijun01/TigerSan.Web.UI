import { ref } from "vue"
import { FormItemConfig, IdNameModel, BigintHelper, Verify, Texts, FormConfig, FormModel } from "@/0_tigersan_ui/tigerui"
import { assetLedgerTable } from "./AssetLedgerTable"
import { companyHelper, departmentHelper, assetTypeHelper, AssetModel } from "@/models"

export class AssetFormModel {
    //#region 【Fields】
    // 选择框:
    readonly selectCompanyForm = companyHelper.GetIdNameSelectModel()
    readonly selectDepartmentForm = departmentHelper.GetIdNameSelectModel()
    readonly selectAssetTypeForm = assetTypeHelper.GetIdNameSelectModel()

    /** “公司”项目配置 */
    readonly configCompany: FormItemConfig<AssetModel, IdNameModel> = {
        _propName: 'company',
        PropTextEN: 'Company',
        PropTextCH: '公司',
        IsEquired: true,
        Target: this.selectCompanyForm.Value,
        _getValue: source => this.selectCompanyForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.company)),
        _setValue: (source, propName, value) => source.company = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.company, 0n, Texts.CannotBeEmpty.value)
    }

    /** “部门”项目配置 */
    readonly configDepartment: FormItemConfig<AssetModel, IdNameModel> = {
        _propName: 'department',
        PropTextEN: 'Department',
        PropTextCH: '部门',
        IsEquired: true,
        Target: this.selectDepartmentForm.Value,
        _getValue: source => this.selectDepartmentForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.department)),
        _setValue: (source, propName, value) => source.department = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.department, 0n, Texts.CannotBeEmpty.value)
    }

    /** “类型”项目配置 */
    readonly configAssetType: FormItemConfig<AssetModel, IdNameModel> = {
        _propName: 'type',
        PropTextEN: 'Type',
        PropTextCH: '类型',
        IsEquired: true,
        Target: this.selectAssetTypeForm.Value,
        _getValue: source => this.selectAssetTypeForm.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, source.type)),
        _setValue: (source, propName, value) => source.type = value && value.id != undefined ? value.id : 0n,
        _isVerifyOk: source => Verify.IsBigintGreaterThan(source.type, 0n, Texts.CannotBeEmpty.value)
    }

    /** “资产ID”项目配置 */
    readonly configAssetId: FormItemConfig<AssetModel, string> = {
        _propName: 'assetId',
        PropTextEN: 'AssetId',
        PropTextCH: '资产ID',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsNotUndefinedOrEmpty(source.assetId)
    }

    /** “标签ID”项目配置 */
    readonly configTagId: FormItemConfig<AssetModel, string> = {
        _propName: 'tagId',
        PropTextEN: 'TagId',
        PropTextCH: '标签ID',
        IsEquired: false,
        Target: ref(),
    }

    /** “名称”项目配置 */
    readonly configName: FormItemConfig<AssetModel, string> = {
        _propName: 'name',
        PropTextEN: 'Name',
        PropTextCH: '名称',
        IsEquired: false,
        Target: ref(),
    }

    /** “备注”项目配置 */
    readonly configComment: FormItemConfig<AssetModel, string> = {
        _propName: 'comment',
        PropTextEN: 'Comment',
        PropTextCH: '备注',
        IsEquired: false,
        Target: ref(),
    }

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => new AssetModel()

    /** “资产”表单配置 */
    readonly configAssetLedgerForm: FormConfig<AssetModel> = {
        CancelText: Texts.Cancel.value,
        SubmitText: Texts.Ok.value,
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
            if (isEdit) {
                const rowData = assetLedgerTable.SelectedRowDatas.value[0]
                if (!rowData) {
                    console.warn('The rowData is undefined!')
                    return
                }

                await this.selectCompanyForm.UpdateItemsAsync()
                this.selectCompanyForm.Value.value = companyHelper.GetIdName(rowData.company)
                await this.selectDepartmentForm.UpdateItemsAsync()
                this.selectDepartmentForm.Value.value = departmentHelper.GetIdName(rowData.department)
                await this.selectAssetTypeForm.UpdateItemsAsync()
                this.selectAssetTypeForm.Value.value = assetTypeHelper.GetIdName(rowData.type)
            }
        },
        _itemConfigs: [
            this.configCompany,
            this.configDepartment,
            this.configAssetType,
            this.configAssetId,
            this.configTagId,
            this.configName,
            this.configComment,
        ]
    }

    /** “资产”表单模型 */
    readonly assetForm = new FormModel(this.configAssetLedgerForm)
    //#endregion 【Fields】

    //#region 【Properties】
    /** “公司”是否使能 */
    get IsCompanyEnable() { return this.selectCompanyForm.IsEnabled.value }
    set IsCompanyEnable(value) { this.selectCompanyForm.IsEnabled.value = value }

    /** “标签ID”是否使能 */
    readonly IsTagIdEnable = ref(true)
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor() {
        this.selectDepartmentForm._getItemsAsync = async () => await departmentHelper.SelectIdNameByCompanyAsync(this.selectCompanyForm.Value.value?.id)
        this.selectAssetTypeForm._getItemsAsync = async () => await assetTypeHelper.GetIdNamesByCompany(this.selectCompanyForm.Value.value?.id)
        this.selectCompanyForm._onChange = () => {
            this.selectDepartmentForm.UpdateItemsAsync()
            this.selectAssetTypeForm.UpdateItemsAsync()
        }
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 刷新表单 */
    readonly RefreshForm = async () => {
        await this.selectCompanyForm.UpdateItemsAsync()
        await this.selectDepartmentForm.UpdateItemsAsync()
        await this.selectAssetTypeForm.UpdateItemsAsync()
    }
    //#endregion 【Functions】
}