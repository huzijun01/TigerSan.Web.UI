import { assetHelper } from "@/models"
import { loading, SelectModel, MapModel, ThemeHelper } from "@/0_tigersan_ui/tigerui"

export const selectAddr = new SelectModel<AMap.POI>()
selectAddr.IsAllowSearch.value = true
selectAddr.PlaceholderCN.value = '地址'
selectAddr.PlaceholderEN.value = 'Addr'
selectAddr._converter = source => source.name
selectAddr._onSelect = item => {
    var poi = item.Value.value
    if (poi == undefined) return
    map.ZoomTo(poi.location, MapModel.GetZoom(poi.shopinfo))
}

export const map = new MapModel(undefined, ThemeHelper.IsDark)
map._onInitAsync = async () => {
    const placeSearch = await MapModel.GetPlaceSearchAsync(res => {
        selectAddr.SetItems(res.poiList.pois)
    })

    if (placeSearch) {
        selectAddr._onSearchTextChange = search => {
            placeSearch.search(search)
        }
    }

    const positions = await assetHelper.GetPositionList({})
    const points: AMap.LngLatLike[] = []
    positions.forEach(position => {
        if (position.longitude === undefined || position.latitude === undefined) return
        points.push([position.longitude, position.latitude])
    })

    map.InitClusterAsync(points, {})
}

export async function Refresh() {
    loading.IsShow.value = true
    await map.InitAsync()
    loading.IsShow.value = false
}