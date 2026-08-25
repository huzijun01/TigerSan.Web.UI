import { ref, watch, shallowReactive, toRaw, computed } from "vue"
import { PaginationModel } from "@/0_tigersan_ui/tigerui"
import { PositionDto, PositionInfoModel } from "@/models"

/** “位置列表”模型 */
export class PositionListModel {
    //#region 【Fields】
    /** “数量”监听 */
    readonly watchCount
    /** 分页器 */
    readonly pagination = new PaginationModel()
    /** 点击时 */
    _onClick?: (info: PositionInfoModel) => any
    //#endregion 【Fields】

    //#region 【Props】
    /** 总数 */
    readonly Count = ref<number>(0)
    /** “位置”集合 */
    readonly Positions = shallowReactive<PositionDto[]>([])
    /** “位置信息”集合 */
    readonly PositionInfoes = shallowReactive<PositionInfoModel[]>([])
    /** “位置”集合 */
    readonly rawPositions = computed(() => toRaw(this.Positions))
    //#endregion 【Props】

    //#region 【Ctor】
    constructor() {
        this.pagination.IsShowCount.value = false
        this.pagination.IsShowPageSize.value = false
        this.pagination.IsShowPageTextBox.value = false
        this.watchCount = watch(this.Count, count => this.pagination.Count.value = count)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    readonly SetPositions = (positions: PositionDto[]) => {
        this.Positions.splice(0)
        this.Positions.push(...positions)
        const assets = this.rawPositions.value
        this.PositionInfoes.splice(0)
        this.Count.value = this.Positions.length
        this.pagination.GetPage(assets).forEach(position => {
            const assetInfo = new PositionInfoModel(position)
            assetInfo._onClick = this._onClick
            this.PositionInfoes.push(assetInfo)
        })
    }
    //#endregion 【Functions】
}