import AssetInfo from "@/components/AssetInfo.vue"
import { ref, watch, shallowReactive, toRaw } from "vue"
import { AssetFilter } from '../AssetLedgerPage/AssetFilter'
import { assetHelper, AssetPosition, AssetInfoModel } from "@/models"
import { loading, MapModel, PaginationModel, LnglatData } from "@/0_tigersan_ui/tigerui"

/** 总数 */
export const Count = ref<number>(0)
watch(Count, count => pagination.Count.value = count)

/** 筛选 */
export const filter = new AssetFilter(Refresh)
const {
    searchAssetId,
    selectOnlineState,
    selectCompany,
    selectDepartment,
    selectAssetType,
    selectAssetState,
    selectErrorType,
} = filter

/** 分页器 */
export const pagination = new PaginationModel()
pagination.IsShowCount.value = false
pagination.IsShowPageSize.value = false
pagination.IsShowPageTextBox.value = false
pagination._onChange = UpdateAssetInfoes

/** “位置”集合 */
const Positions = shallowReactive<AssetPosition[]>([])
watch(Positions, UpdateAssetInfoes)

/** “物资信息”集合 */
export const AssetInfoes = shallowReactive<AssetInfoModel[]>([])

/** 地图 */
export const map = new MapModel<AssetPosition>()
map.IsShowButton.value = false
map._onInitAsync = async () => {
    const positions = await assetHelper.GetPositionList({
        company: selectCompany.Value.value?.id,
        department: selectDepartment.Value.value?.id,
        type: selectAssetType.Value.value?.id,
        state: selectAssetState.Value.value,
        states: selectAssetState.NotCheckAllCheckedValues.value,
        onlineState: selectOnlineState.Value.value,
        errorType: selectErrorType.Value.value,
        assetId: searchAssetId.Value.value,
    })
    Positions.splice(0)
    Positions.push(...positions)
}

/** 刷新 */
export async function Refresh() {
    loading.IsShow.value = true
    await filter.UpdateIdNames()
    await AssetInfoModel.UpdateTypeAsync()
    await map.InitAsync()
    loading.IsShow.value = false
}

/** 更新“物资信息”集合 */
export function UpdateAssetInfoes() {
    // 总数:
    Count.value = Positions.length

    // 标记:
    const points: LnglatData<AssetPosition>[] = []
    const positions = toRaw(Positions)
    positions.forEach(position => {
        if (position.longitude != undefined && position.latitude != undefined) {
            const infoModel = new AssetInfoModel(position)
            infoModel.Background.value = 'var(--theme-input-background)'
            const ld = new LnglatData([position.longitude, position.latitude], position)
            ld.info = AssetInfo
            ld.infoModel = infoModel
            ld.onClick = OnMarkerClick
            points.push(ld)
        }
    })
    map.InitClusterAsync(points)

    // 列表:
    AssetInfoes.splice(0)
    pagination.GetPage(positions).forEach(position => {
        const assetInfo = new AssetInfoModel(position)
        assetInfo._onClick = OnItemClick
        AssetInfoes.push(assetInfo)
    })
}

/** 点击“标记”时 */
function OnMarkerClick(position?: AssetPosition) {
}

/** 点击“项目”时 */
function OnItemClick(info: AssetInfoModel) {
    const position = toRaw(info.Position)
    if (!position.longitude || !position.latitude) return
    map.ZoomByVector2([position.longitude, position.latitude])
}