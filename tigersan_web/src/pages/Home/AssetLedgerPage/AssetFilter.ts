import { OnlineState, SearchModel } from "@/0_tigersan_ui/tigerui"
import { companyHelper, departmentHelper, assetTypeHelper, AssetState, ErrorType } from "@/models"

export class AssetFilter {
    _refresh?: any
    /** 搜索框 */
    readonly searchAssetId = new SearchModel()
    /** 筛选 */
    readonly selectOnlineState = OnlineState.GetSelectModel()
    readonly selectCompany = companyHelper.GetIdNameSelectModel()
    readonly selectDepartment = departmentHelper.GetIdNameSelectModel()
    readonly selectAssetType = assetTypeHelper.GetIdNameSelectModel()
    readonly selectAssetState = AssetState.GetSelectModel()
    readonly selectErrorType = ErrorType.GetSelectModel()

    constructor(refresh?: Function) {
        this._refresh = refresh
        this.searchAssetId.PlaceholderCN.value = '资产ID'
        this.searchAssetId.PlaceholderEN.value = 'Asset ID'
        this.searchAssetId._onChange = this._refresh
        this.searchAssetId._onSearch = this._refresh

        this.selectCompany._onChange = this._refresh
        this.selectDepartment._onChange = this._refresh
        this.selectAssetType._onChange = this._refresh
        this.selectAssetState.CheckAll()
        this.selectAssetState.IsAllowMultiSelect.value = true
        this.selectAssetState._onCheckedItemsChange = this._refresh
        this.selectOnlineState._onChange = this._refresh
        this.selectErrorType._onChange = this._refresh
        this.selectDepartment._getItemsAsync = async () => this.selectCompany.Value.value ? await departmentHelper.SelectIdNameByCompanyAsync(this.selectCompany.Value.value?.id) : []
    }

    readonly UpdateIdNames = async () => {
        await companyHelper.UpdateIdNames()
        await departmentHelper.UpdateIdNames()
        await assetTypeHelper.UpdateIdNames()
        await this.selectCompany.UpdateItemsAsync()
        await this.selectDepartment.UpdateItemsAsync()
        await this.selectAssetType.UpdateItemsAsync()
    }
}