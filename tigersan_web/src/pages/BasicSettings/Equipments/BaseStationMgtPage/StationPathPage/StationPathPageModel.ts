import AssetInfo from "@/components/AssetInfo.vue"
import { ref, shallowReactive, toRaw, watch } from 'vue'
import { DatePickerModel, DateType, LnglatData, loading, MapModel, PaginationModel } from '@/0_tigersan_ui/tigerui'
import { stationRecordHelper, LocationMode, AssetInfoModel, AssetLngLat, AssetPosition } from '@/models'

export class StationPathPageModel {
    _station?: bigint
    /** “定位方式”选择器 */
    readonly selectLocationMode = LocationMode.GetSelectModel()
    /** 地图 */
    readonly map = new MapModel<any, AssetInfoModel>({ animateEnable: false })

    /** 日期 */
    readonly date = new DatePickerModel()
    /** 总数 */
    readonly Count = ref<number>(0)
    /** 分页器 */
    readonly pagination = new PaginationModel()
    /** “位置”集合 */
    readonly Positions = shallowReactive<AssetLngLat[]>([])
    /** “基站信息”集合 */
    readonly StationInfoes = shallowReactive<AssetInfoModel[]>([])

    constructor() {
        this.date._type = DateType.datetimerange
        this.date._onChange = this.Refresh
        this.pagination.IsShowCount.value = false
        this.pagination.IsShowPageTextBox.value = false
        this.pagination.SetPageSize([50, 100, 150, 200])
        this.pagination._onChange = this.Refresh
        this.selectLocationMode._onChange = this.Refresh

        watch(this.Positions, this.UpdateStationInfoes)
        watch(this.Count, count => this.pagination.Count.value = count)

        this.map._isAutoInit = false
        this.map.IsShowSelect.value = false
        this.map.IsShowButton.value = false
        this.map._onInitAsync = async () => {
            try {
                loading.IsShow.value = true
                this.Positions.splice(0)

                if (!this._station || this._station == 0n) {
                    console.warn('The _station is undefined!')
                    return
                }

                const polyline = await this.map.InitPolylineAsync()
                if (!polyline) {
                    console.warn('The polyline is undefined!')
                    return
                }

                // 总数:
                const resCount = await stationRecordHelper.GetCoordCount({
                    station: this._station,
                    start: this.date.Start.value,
                    end: this.date.End.value,
                    locationMode: this.selectLocationMode.Value.value,
                })
                const count = resCount.data
                if (count === undefined) {
                    console.warn('The count is undefined!')
                    return
                }
                this.Count.value = count

                // 路径:
                const res = await stationRecordHelper.GetPath({
                    station: this._station,
                    pageSize: this.pagination.PageSize.value,
                    pageNumber: this.pagination.SelectedNum.value,
                    start: this.date.Start.value,
                    end: this.date.End.value,
                    locationMode: this.selectLocationMode.Value.value,
                })
                const stationLngLats = res.data
                if (!stationLngLats) {
                    console.warn('The stationLngLats is undefined!')
                    return
                }

                this.Positions.splice(0)
                stationLngLats.forEach(i => {
                    if (!i.longitude || !i.latitude) return
                    const lngLat = new AssetLngLat()
                    lngLat.longitude = i.longitude
                    lngLat.latitude = i.latitude
                    lngLat.address = i.address
                    lngLat.reportTime = i.reportTime
                    lngLat.locationMode = i.locationMode
                    this.Positions.push(lngLat)
                })

                const lngLats = stationLngLats.map(p => new AMap.LngLat(p.longitude ?? 0, p.latitude ?? 0))
                this.map.SetPath(lngLats)
                this.map.ZoomByLngLats(lngLats)
            } finally {
                loading.IsShow.value = false
            }
        }
    }

    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            await this.map.InitAsync()
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 更新“基站信息”集合 */
    readonly UpdateStationInfoes = () => {
        // 标记:
        const positions = toRaw(this.Positions)
        const points: LnglatData<AssetInfoModel, AssetInfoModel>[] = positions.map(position => {
            const infoModel = new AssetInfoModel(this.GetStationPosition(position))
            infoModel.Background.value = 'var(--theme-input-background)'
            return new LnglatData([position.longitude, position.latitude], infoModel, AssetInfo, infoModel)
        })

        this.map.ClearMarkers()
        this.map.AddMarkers(points)
        this.map.InitFlag()

        // 列表:
        this.StationInfoes.splice(0)
        positions.slice().reverse().forEach(position => {
            const stationInfo = new AssetInfoModel(this.GetStationPosition(position))
            stationInfo._onClick = this.OnItemClick
            this.StationInfoes.push(stationInfo)
        })
    }

    /** 点击“标记”时 */
    readonly OnMarkerClick = (data?: AssetInfoModel) => {
    }

    /** 点击“项目”时 */
    readonly OnItemClick = (info: AssetInfoModel) => {
        const position = toRaw(info.Position)
        if (!position.longitude || !position.latitude) return
        const point: AMap.Vector2 = [position.longitude, position.latitude]
        this.map.SetMarker(point)
        this.map.ZoomByVector2(point)
    }

    /** 获取“资产位置” */
    readonly GetStationPosition = (position: AssetLngLat) => {
        const ap = new AssetPosition()
        if (position.address) ap.assetId = position.address
        ap.longitude = position.longitude
        ap.latitude = position.latitude
        ap.reportTime = position.reportTime
        ap.locationMode = position.locationMode
        return ap
    }
}