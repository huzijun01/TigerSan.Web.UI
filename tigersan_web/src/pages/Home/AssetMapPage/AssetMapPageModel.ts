import PositionInfo from "@/components/PositionInfo.vue"
import { ref, watch, shallowReactive, toRaw } from "vue"
import { loading, MapModel, PaginationModel, LnglatData, DrawerModel, RowDataModel } from "@/0_tigersan_ui/tigerui"
import { AssetFilter } from '../AssetLedgerPage/AssetFilter'
import { assetHelper, baseStationHelper, PositionDto, PositionInfoModel, PositionTypes } from "@/models"
import { AssetStateModel } from "../AssetLedgerPage/AssetStatePage/AssetStateModel"
import { CompanyMgtForm } from "@/pages/BasicSettings/BasicSettings/CompanyMgtPage/CompanyMgtForm"
import { GetStationTable } from "@/pages/BasicSettings/Equipments/BaseStationMgtPage/BaseStationMgtTable"

export class AssetMapPageModel {
    //#region 【Fields】
    /** 筛选 */
    readonly filter: AssetFilter
    /** 总数 */
    readonly Count = ref<number>(0)
    /** 分页器 */
    readonly pagination = new PaginationModel()
    /** “位置”集合 */
    readonly Positions = shallowReactive<PositionDto[]>([])
    /** “位置信息”集合 */
    readonly PositionInfoes = shallowReactive<PositionInfoModel[]>([])
    /** 地图 */
    readonly map = new MapModel<PositionDto, PositionInfoModel>({ animateEnable: false })
    /** “资产状态”抽屉 */
    readonly drawerState = new DrawerModel()
    /** 资产状态 */
    readonly assetState = new AssetStateModel()
    /** 基站详情 */
    readonly station = new RowDataModel(GetStationTable())
    //#endregion 【Fields】

    //#region 【Props】
    readonly IsStation = ref(false)
    //#endregion 【Props】

    //#region 【Ctor】
    constructor() {
        this.filter = new AssetFilter(this.Refresh)

        this.pagination.IsShowCount.value = false
        this.pagination.IsShowPageSize.value = false
        this.pagination.IsShowPageTextBox.value = false
        this.pagination._onChange = this.UpdatePositionInfoes

        watch(this.Positions, this.UpdatePositionInfoes)
        watch(this.Count, count => this.pagination.Count.value = count)

        this.map.IsShowButton.value = false
        this.map._getIcon = PositionDto.GetIcon
        this.map._onInitAsync = async () => {
            const filter = this.filter
            const assetPositions = await assetHelper.GetPositionList({
                companies: CompanyMgtForm.AccessibleCompanies.value,
                department: filter.selectDepartment.Value.value?.id,
                type: filter.selectAssetType.Value.value?.id,
                tagType: filter.selectTagType.Value.value?.id,
                state: filter.selectAssetState.Value.value,
                states: filter.selectAssetState.NotCheckAllCheckedValues.value,
                onlineState: filter.selectOnlineState.Value.value,
                isAuto: filter.selectIsAuto.Value.value,
                isFall: filter.selectIsFall.Value.value,
                errorType: filter.selectErrorType.Value.value,
                name: filter.searchName.Value.value,
                rfid: filter.searchRfid.Value.value,
                assetId: filter.searchAssetId.Value.value,
                tagId: filter.searchTagId.Value.value,
                stationId: filter.searchStationId.Value.value,
            })
            this.Positions.splice(0)
            this.Positions.push(...assetPositions)
            const stationPositions = await baseStationHelper.GetPositionList({
                companies: CompanyMgtForm.AccessibleCompanies.value,
            })
            stationPositions.forEach(i => i.type = PositionTypes.Station)
            this.Positions.push(...stationPositions)
        }
        this.map._onMarkerClick = data => {
            if (!data?.data) return
            this.map.SetMarker(data.lnglat)
            this.drawerState.Title.value = data.data.info

            if (data.data.type === PositionTypes.Station) {
                baseStationHelper.GetFull(undefined, data.data.info).then(res => {
                    if (res) {
                        this.IsStation.value = true
                        this.station.Data.value = res.data
                        this.drawerState.Show()
                    }
                })
            } else {
                this.assetState.Init(data.data.info).then(res => {
                    if (res) {
                        this.IsStation.value = false
                        this.drawerState.Show()
                    }
                })
            }
        }
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 刷新 */
    readonly Refresh = async () => {
        loading.IsShow.value = true
        await this.filter.UpdateIdNames()
        await PositionInfoModel.UpdateTypeAsync()
        await this.map.InitAsync()
        loading.IsShow.value = false
    }

    /** 更新“位置信息”集合 */
    readonly UpdatePositionInfoes = () => {
        // 总数:
        this.Count.value = this.Positions.length

        // 标记:
        const points: LnglatData<PositionDto, PositionInfoModel>[] = []
        const positions = toRaw(this.Positions)
        positions.forEach(position => {
            if (position.longitude != undefined && position.latitude != undefined) {
                const infoModel = new PositionInfoModel(position)
                infoModel.Background.value = 'var(--theme-input-background)'
                const ld = new LnglatData([position.longitude, position.latitude], position, PositionInfo, infoModel)
                points.push(ld)
            }
        })
        this.map.InitClusterAsync(points)

        // 列表:
        this.PositionInfoes.splice(0)
        this.pagination.GetPage(positions).forEach(position => {
            const assetInfo = new PositionInfoModel(position)
            assetInfo._onClick = this.OnItemClick
            this.PositionInfoes.push(assetInfo)
        })
    }

    /** 点击“项目”时 */
    readonly OnItemClick = (info: PositionInfoModel) => {
        const position = toRaw(info.Position)
        if (!position.longitude || !position.latitude) return
        const point: AMap.Vector2 = [position.longitude, position.latitude]
        this.map.SetMarker(point)
        this.map.ZoomByVector2(point)
        this.drawerState.Title.value = position.info

        if (info.Position.type === PositionTypes.Station) {
            baseStationHelper.GetFull(undefined, position.info).then(res => {
                if (res) {
                    this.IsStation.value = true
                    this.station.Data.value = res.data
                    this.drawerState.Show()
                }
            })
        } else {
            this.assetState.Init(position.info).then(res => {
                if (res) {
                    this.IsStation.value = false
                    this.drawerState.Show()
                }
            })
        }
    }
    //#endregion 【Functions】
}