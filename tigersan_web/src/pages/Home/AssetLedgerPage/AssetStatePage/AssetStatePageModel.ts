import { computed, ref, shallowRef } from 'vue'
import { loading, MapModel, MyActionResult, StringHelper } from '@/0_tigersan_ui/tigerui'
import { TagModel, AssetInfoModel, AssetModel, assetHelper, tagHelper, LocationMode } from '@/models'

export class AssetStatePageModel {
    /** 地图 */
    readonly map = new MapModel<any, AssetInfoModel>({ animateEnable: false })

    /** 资产 */
    readonly Asset = ref<AssetModel | undefined>()
    /** 位置 */
    readonly Tag = shallowRef<TagModel>()
    /** 定位方式 */
    readonly LocationMode = computed(() => LocationMode.GetName(this.Tag.value?.locationMode))
    /** 是否显示“定位方式” */
    readonly IsShowLocationMode = computed(() => StringHelper.IsNotEmpty(this.LocationMode.value))

    constructor() {
        this.map._isAutoInit = false
        this.map.IsShowSelect.value = false
        this.map.IsShowButton.value = false
        this.map._onInitAsync = async () => {
            try {
                loading.IsShow.value = true

                const asset = this.Asset.value
                if (!asset) {
                    console.warn('The asset is undefined!')
                    return
                }

                if (!asset.assetId) return

                const res = await assetHelper.GetPosition(asset.id)
                const position = res.data
                if (!position) {
                    MyActionResult.ShowResult(res, '', false)
                    return
                }

                if (!position.longitude || !position.latitude) return
                const lngLat = new AMap.LngLat(position.longitude, position.latitude)
                this.map.Add(new AMap.Marker({ position: lngLat }))
                this.map.ZoomByLngLat(lngLat)
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

            const tagId = this.Asset.value?.tagId
            if (tagId) {
                const res = await tagHelper.GetFull(tagId)
                if (!res.data) {
                    MyActionResult.ShowResult(res)
                    return
                }
                this.Tag.value = res.data
            }
        } finally {
            loading.IsShow.value = false
        }
    }
}