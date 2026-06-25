import { IsFall, OnlineState, SearchModel, WatchBehavior } from "@/0_tigersan_ui/tigerui"
import { CompanyMgtForm } from "@/pages/BasicSettings/BasicSettings/CompanyMgtPage/CompanyMgtForm"
import { companyHelper, departmentHelper, assetTypeHelper, AssetState, ErrorType, tagTypeHelper } from "@/models"

export class AssetFilter {
    _refresh?: any
    /** “可访问公司”监听器 */
    readonly watchAccessibleCompanies
    /** 搜索框 */
    readonly searchAssetId = new SearchModel()
    readonly searchRfid = new SearchModel()
    /** 筛选 */
    readonly selectOnlineState = OnlineState.GetSelectModel()
    readonly selectIsFall = IsFall.GetSelectModel()
    readonly selectDepartment = departmentHelper.GetIdNameSelectModel()
    readonly selectAssetType = assetTypeHelper.GetIdNameSelectModel()
    readonly selectTagType = tagTypeHelper.GetIdNameSelectModel()
    readonly selectAssetState = AssetState.GetSelectModel()
    readonly selectErrorType = ErrorType.GetSelectModel()

    constructor(refresh?: Function) {
        this._refresh = refresh
        this.searchAssetId.PlaceholderCN.value = '资产ID'
        this.searchAssetId.PlaceholderEN.value = 'Asset ID'
        this.searchAssetId._onChange = this._refresh
        this.searchAssetId._onSearch = this._refresh

        this.searchRfid.PlaceholderCN.value = 'RFID'
        this.searchRfid.PlaceholderEN.value = 'RFID'
        this.searchRfid._onChange = this._refresh
        this.searchRfid._onSearch = this._refresh

        this.selectAssetState.IsSelectAll.value = true
        this.selectAssetState.IsAllowMultiSelect.value = true
        this.selectDepartment._getItemsAsync = async () => await departmentHelper.SelectIdNameByCompanyAsync(undefined, CompanyMgtForm.AccessibleCompanies.value)
        this.selectDepartment._onChange = this._refresh
        this.selectAssetType._onChange = this._refresh
        this.selectTagType._onChange = this._refresh
        this.selectAssetState._onCheckedItemsChange = this._refresh
        this.selectOnlineState._onChange = this._refresh
        this.selectIsFall._onChange = this._refresh
        this.selectErrorType._onChange = this._refresh

        this.watchAccessibleCompanies = new WatchBehavior(CompanyMgtForm.AccessibleCompanies, this._refresh)
    }

    readonly UpdateIdNames = async () => {
        await companyHelper.UpdateIdNames()
        await departmentHelper.UpdateIdNames()
        await assetTypeHelper.UpdateIdNames()
        await this.selectDepartment.UpdateItemsAsync()
        await this.selectAssetType.UpdateItemsAsync()
    }

    readonly StartWatch = () => {
        this.watchAccessibleCompanies.Start()
    }

    readonly StopWatch = () => {
        this.watchAccessibleCompanies.Stop()
    }
}

export class AssetFilterForm {
}