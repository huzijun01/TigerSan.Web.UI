import { nanoid } from "nanoid"
import { computed, reactive, ref, type Reactive } from "vue"
import { Icons, ObjectHelper, StringHelper } from '@/0_tigersan_ui/tigerui'
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
    /** 资产位置 */
    readonly Position: Reactive<AssetPosition>
    /** 图标 */
    readonly Icon = ref(Icons.Product)
    /** 背景 */
    readonly Background = ref<string | undefined>()

    //#region [computed]
    /** 标题 */
    readonly Title = computed(() => this.Position.assetId)
    /** “类型”文本 */
    readonly TypeText = computed(() => assetTypeHelper.GetName(this.Position.type))
    /** 是否显示“类型文本” */
    readonly IsShowTypeText = computed(() => StringHelper.IsNotEmpty(this.TypeText.value))
    /** “上报时间”文本 */
    readonly ReportTimeText = computed(() => ObjectHelper.GetDateString(this.Position.reportTime))
    /** 样式对象 */
    readonly StyleObj = computed(() => {
        return {
            background: this.Background.value
        }
    })
    //#endregion [computed]
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