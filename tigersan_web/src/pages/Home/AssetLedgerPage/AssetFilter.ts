import { OnlineState, SearchModel } from "@/0_tigersan_ui/tigerui"
import { companyHelper, departmentHelper, assetTypeHelper, AssetState, ErrorType } from "@/models"

export class AssetFilter {
    /** 搜索框 */
    readonly searchAssetId = new SearchModel()
    /** 筛选 */
    readonly selectOnlineState = OnlineState.GetSelectModel()
    readonly selectCompany = companyHelper.GetIdNameSelectModel()
    readonly selectDepartment = departmentHelper.GetIdNameSelectModel()
    readonly selectAssetType = assetTypeHelper.GetIdNameSelectModel()
    readonly selectAssetState = AssetState.GetSelectModel()
    readonly selectErrorType = ErrorType.GetSelectModel()

    constructor(refresh: Function) {
        this.searchAssetId.PlaceholderCN.value = '资产ID'
        this.searchAssetId.PlaceholderEN.value = 'Asset ID'
        this.searchAssetId._onChange = refresh as any
        this.searchAssetId._onSearch = refresh as any

        this.selectCompany._onChange = refresh as any
        this.selectDepartment._onChange = refresh as any
        this.selectAssetType._onChange = refresh as any
        this.selectAssetState._onChange = refresh as any
        this.selectOnlineState._onChange = refresh as any
        this.selectErrorType._onChange = refresh as any
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