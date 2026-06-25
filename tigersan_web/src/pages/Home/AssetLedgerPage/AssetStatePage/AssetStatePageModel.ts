import { ref, shallowRef } from 'vue'
import { loading, MapModel, MyActionResult } from '@/0_tigersan_ui/tigerui'
import { TagModel, AssetInfoModel, AssetModel, assetHelper } from '@/models'

export class AssetStatePageModel {
    /** 地图 */
    readonly map = new MapModel<any, AssetInfoModel>({ animateEnable: false })

    /** 资产 */
    readonly Asset = ref<AssetModel | undefined>()
    /** 位置 */
    readonly Tag = shallowRef<TagModel>()

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
        } finally {
            loading.IsShow.value = false
        }
    }
}