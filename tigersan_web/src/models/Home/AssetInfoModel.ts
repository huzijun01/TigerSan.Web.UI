import { nanoid } from "nanoid"
import { computed, reactive, ref, type Reactive } from "vue"
import { Icons, ObjectHelper } from '@/0_tigersan_ui/tigerui'
import { AssetPosition } from "./AssetModel"
import { assetTypeHelper } from "../Dictionaries/DictionaryModels"

/** “物资信息”模型 */
export class AssetInfoModel {
    //#region 【Fields】
    readonly _id = nanoid()
    /** 点击时 */
    _onClick?: (info: AssetInfoModel) => void
    //#endregion 【Fields】

    //#region 【Properties】
    readonly Position: Reactive<AssetPosition>
    readonly Icon = ref(Icons.Product)
    readonly Title = computed(() => this.Position.assetId)
    readonly TypeText = computed(() => assetTypeHelper.GetName(this.Position.type))
    readonly ReportTimeText = computed(() => ObjectHelper.GetDateString(this.Position.reportTime))
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(position: AssetPosition) {
        this.Position = reactive<AssetPosition>(position)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 更新类型 */
    static UpdateTypeAsync = async () => {
        await assetTypeHelper.UpdateIdNames()
    }

    /** 点击时 */
    readonly OnClick = () => {
        this._onClick?.(this)
    }
    //#endregion 【Functions】
}