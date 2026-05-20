import { ref, watch, shallowReactive, toRaw } from "vue"
import { assetHelper, AssetPosition, AssetInfoModel } from "@/models"
import { loading, SelectModel, MapModel, ThemeHelper, PaginationModel } from "@/0_tigersan_ui/tigerui"

/** 总数 */
export const Count = ref<number>(0)
watch(Count, count => pagination.Count.value = count)

/** 分页器 */
export const pagination = new PaginationModel()
pagination.IsShowCount.value = false
pagination.IsShowPageSize.value = false
pagination.IsShowPageTextBox.value = false
pagination._onChange = UpdateAssetInfoes

/** “地址”选择器 */
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

/** “位置”集合 */
const Positions = shallowReactive<AssetPosition[]>([])
watch(Positions, UpdateAssetInfoes)

/** “物资信息”集合 */
export const AssetInfoes = shallowReactive<AssetInfoModel[]>([])

/** 地图 */
export const map = new MapModel(undefined, ThemeHelper.IsDark)
map._onInitAsync = async () => {
    const placeSearch = await MapModel.GetPlaceSearchAsync(res => {
        selectAddr.SetItems(res.poiList.pois)
        selectAddr.IsLoading.value = false
    })

    if (placeSearch) {
        selectAddr._onSearchTextChange = search => {
            selectAddr.IsLoading.value = true
            placeSearch.search(search)
        }
    }

    const positions = await assetHelper.GetPositionList({})
    Positions.splice(0)
    Positions.push(...positions)
}

/** 刷新 */
export async function Refresh() {
    loading.IsShow.value = true
    await AssetInfoModel.UpdateTypeAsync()
    await map.InitAsync()
    Count.value = Positions.length
    loading.IsShow.value = false
}

/** 更新“物资信息”集合 */
export function UpdateAssetInfoes() {
    // 标记:
    const points: AMap.Vector2[] = []
    const positions = toRaw(Positions)
    positions.forEach(position => {
        if (position.longitude != undefined && position.latitude != undefined) {
            points.push([position.longitude, position.latitude])
        }
    })
    map.InitClusterAsync(points, {})

    // 列表:
    AssetInfoes.splice(0)
    pagination.GetPage(positions).forEach(position => {
        const assetInfo = new AssetInfoModel(position)
        assetInfo._onClick = OnClick
        AssetInfoes.push(assetInfo)
    })
}

/** 点击时 */
function OnClick(info: AssetInfoModel) {
    if (info.Position.longitude === undefined || info.Position.latitude === undefined) return
    map.ZoomByVector2([info.Position.longitude, info.Position.latitude])
}