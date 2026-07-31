import { nanoid } from "nanoid"
import { computed, reactive, ref, type Reactive, type StyleValue } from "vue"
import { Icons, ObjectHelper, StringHelper } from '@/0_tigersan_ui/tigerui'
import { AssetPosition } from "./AssetModel"
import { LocationMode } from "../base/AssetStates"
import { assetTypeHelper } from "../Dictionaries/DictionaryModels"

/** “物资信息”模型 */
export class AssetInfoModel {
    //#region 【Fields】
    readonly _id = nanoid()
    /** 点击时 */
    _onClick?: (info: AssetInfoModel) => any
    //#endregion 【Fields】

    //#region 【Props】
    /** 资产位置 */
    readonly Position: Reactive<AssetPosition>
    /** 图标 */
    readonly Icon = ref(Icons.Product)
    /** 背景 */
    readonly Background = ref<string | undefined>()

    //#region [computed]
    /** 标题 */
    readonly Title = computed(() => this.Position.assetId)
    /** “定位方式”文本 */
    readonly LocationModeText = computed(() => LocationMode.GetName(this.Position.locationMode))
    /** 是否显示“定位方式”文本 */
    readonly IsShowLocationModeText = computed(() => StringHelper.IsNotEmpty(this.LocationModeText.value))
    /** “上报时间”文本 */
    readonly ReportTimeText = computed(() => ObjectHelper.GetDateString(this.Position.reportTime))
    /** 样式对象 */
    readonly Style = computed((): StyleValue => {
        return {
            background: this.Background.value
        }
    })
    //#endregion [computed]
    //#endregion 【Props】

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