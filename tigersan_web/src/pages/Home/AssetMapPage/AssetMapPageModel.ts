import AssetInfo from "@/components/AssetInfo.vue"
import { ref, watch, shallowReactive, toRaw } from "vue"
import { AssetFilter } from '../AssetLedgerPage/AssetFilter'
import { assetHelper, AssetPosition, AssetInfoModel } from "@/models"
import { loading, MapModel, PaginationModel, LnglatData, PopWindowModel } from "@/0_tigersan_ui/tigerui"
import { CompanyMgtForm } from "@/pages/BasicSettings/BasicSettings/CompanyMgtPage/CompanyMgtForm"
import { AssetStateModel } from "../AssetLedgerPage/AssetStatePage/AssetStateModel"

export class AssetMapPageModel {
    //#region 【Fields】
    /** 筛选 */
    readonly filter: AssetFilter
    /** 总数 */
    readonly Count = ref<number>(0)
    /** 分页器 */
    readonly pagination = new PaginationModel()
    /** “位置”集合 */
    readonly Positions = shallowReactive<AssetPosition[]>([])
    /** “物资信息”集合 */
    readonly AssetInfoes = shallowReactive<AssetInfoModel[]>([])
    /** 地图 */
    readonly map = new MapModel<AssetPosition, AssetInfoModel>({ animateEnable: false })
    /** “资产状态”弹窗 */
    readonly popState = new PopWindowModel()
    /** 资产状态 */
    readonly assetState = new AssetStateModel()
    //#endregion 【Fields】

    //#region 【Ctor】
    constructor() {
        this.filter = new AssetFilter(this.Refresh)

        this.pagination.IsShowCount.value = false
        this.pagination.IsShowPageSize.value = false
        this.pagination.IsShowPageTextBox.value = false
        this.pagination._onChange = this.UpdateAssetInfoes

        watch(this.Positions, this.UpdateAssetInfoes)
        watch(this.Count, count => this.pagination.Count.value = count)

        this.popState.MaskStyle.value = {
            justifyContent: 'end',
            paddingRight: '5%',
            backdropFilter: 'none',
            pointerEvents: 'none',
            background: 'transparent',
        }
        this.map.IsShowButton.value = false
        this.map._onInitAsync = async () => {
            const filter = this.filter
            const positions = await assetHelper.GetPositionList({
                companies: CompanyMgtForm.AccessibleCompanies.value,
                department: filter.selectDepartment.Value.value?.id,
                type: filter.selectAssetType.Value.value?.id,
                state: filter.selectAssetState.Value.value,
                states: filter.selectAssetState.NotCheckAllCheckedValues.value,
                onlineState: filter.selectOnlineState.Value.value,
                isFall: filter.selectIsFall.Value.value,
                errorType: filter.selectErrorType.Value.value,
                assetId: filter.searchAssetId.Value.value,
            })
            this.Positions.splice(0)
            this.Positions.push(...positions)
        }
        this.map._onMarkerClick = data => {
            if (!data?.data) return
            this.popState.Title.value = data.data.assetId
            this.assetState.Init(data.data.assetId).then(res => {
                if (res) this.popState.Show()
            })
        }
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 刷新 */
    readonly Refresh = async () => {
        loading.IsShow.value = true
        await this.filter.UpdateIdNames()
        await AssetInfoModel.UpdateTypeAsync()
        await this.map.InitAsync()
        loading.IsShow.value = false
    }

    /** 更新“物资信息”集合 */
    readonly UpdateAssetInfoes = () => {
        // 总数:
        this.Count.value = this.Positions.length

        // 标记:
        const points: LnglatData<AssetPosition, AssetInfoModel>[] = []
        const positions = toRaw(this.Positions)
        positions.forEach(position => {
            if (position.longitude != undefined && position.latitude != undefined) {
                const infoModel = new AssetInfoModel(position)
                infoModel.Background.value = 'var(--theme-input-background)'
                const ld = new LnglatData([position.longitude, position.latitude], position, AssetInfo, infoModel)
                points.push(ld)
            }
        })
        this.map.InitClusterAsync(points)

        // 列表:
        this.AssetInfoes.splice(0)
        this.pagination.GetPage(positions).forEach(position => {
            const assetInfo = new AssetInfoModel(position)
            assetInfo._onClick = this.OnItemClick
            this.AssetInfoes.push(assetInfo)
        })
    }

    /** 点击“项目”时 */
    readonly OnItemClick = (info: AssetInfoModel) => {
        const position = toRaw(info.Position)
        if (!position.longitude || !position.latitude) return
        this.map.ZoomByVector2([position.longitude, position.latitude])
        this.popState.Title.value = position.assetId
        this.assetState.Init(position.assetId).then(res => {
            if (res) this.popState.Show()
        })
    }
    //#endregion 【Functions】
}