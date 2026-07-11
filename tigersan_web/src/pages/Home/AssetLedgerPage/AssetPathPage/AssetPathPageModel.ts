import AssetInfo from "@/components/AssetInfo.vue"
import { ref, shallowReactive, toRaw, watch } from 'vue'
import { DatePickerModel, DateType, LnglatData, loading, MapModel, PaginationModel } from '@/0_tigersan_ui/tigerui'
import { assetRecordHelper, AssetLngLat, AssetInfoModel, AssetPosition, LocationMode } from '@/models'

export class AssetPathPageModel {
    _asset?: bigint
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
    /** “物资信息”集合 */
    readonly AssetInfoes = shallowReactive<AssetInfoModel[]>([])

    constructor() {
        this.date._type = DateType.datetimerange
        this.date._onChange = this.Refresh
        this.pagination.IsShowCount.value = false
        this.pagination.IsShowPageSize.value = false
        this.pagination.IsShowPageTextBox.value = false
        this.pagination._onChange = this.UpdateAssetInfoes
        this.selectLocationMode._onChange = this.Refresh

        watch(this.Positions, this.UpdateAssetInfoes)
        watch(this.Count, count => this.pagination.Count.value = count)

        this.map._isAutoInit = false
        this.map.IsShowSelect.value = false
        this.map.IsShowButton.value = false
        this.map._onInitAsync = async () => {
            try {
                loading.IsShow.value = true

                if (!this._asset || this._asset == 0n) {
                    console.warn('The _asset is undefined!')
                    return
                }

                const polyline = await this.map.InitPolylineAsync()
                if (!polyline) {
                    console.warn('The polyline is undefined!')
                    return
                }

                console.log(this.selectLocationMode.Value.value)
                const res = await assetRecordHelper.GetPath({
                    asset: this._asset,
                    start: this.date.Start.value,
                    end: this.date.End.value,
                    locationMode: this.selectLocationMode.Value.value,
                })
                const assetLngLats = res.data
                if (!assetLngLats) {
                    console.warn('The assetLngLats is undefined!')
                    return
                }

                this.Positions.splice(0)
                this.Positions.push(...assetLngLats)

                const lngLats = assetLngLats.map(p => new AMap.LngLat(p.longitude, p.latitude))
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

    /** 更新“物资信息”集合 */
    readonly UpdateAssetInfoes = () => {
        // 总数:
        this.Count.value = this.Positions.length

        // 标记:
        const positions = toRaw(this.Positions)
        const points: LnglatData<AssetInfoModel, AssetInfoModel>[] = positions.map(position => {
            const infoModel = new AssetInfoModel(this.GetAssetPosition(position))
            infoModel.Background.value = 'var(--theme-input-background)'
            const ld = new LnglatData([position.longitude, position.latitude], infoModel, AssetInfo, infoModel)
            ld.onClick = this.OnMarkerClick
            return ld
        })

        this.map.ClearMarkers()
        this.map.AddMarkers(points)
        this.map.InitFlag()

        // 列表:
        this.AssetInfoes.splice(0)
        this.pagination.GetPage(positions.slice().reverse()).forEach(position => {
            const assetInfo = new AssetInfoModel(this.GetAssetPosition(position))
            assetInfo._onClick = this.OnItemClick
            this.AssetInfoes.push(assetInfo)
        })
    }

    /** 点击“标记”时 */
    readonly OnMarkerClick = (data?: AssetInfoModel) => {
    }

    /** 点击“项目”时 */
    readonly OnItemClick = (info: AssetInfoModel) => {
        const position = toRaw(info.Position)
        if (!position.longitude || !position.latitude) return
        this.map.ZoomByVector2([position.longitude, position.latitude])
    }

    /** 获取“资产位置” */
    readonly GetAssetPosition = (position: AssetLngLat) => {
        const ap = new AssetPosition()
        if (position.address) ap.assetId = position.address
        ap.longitude = position.longitude
        ap.latitude = position.latitude
        ap.reportTime = position.reportTime
        ap.locationMode = position.locationMode
        return ap
    }
}