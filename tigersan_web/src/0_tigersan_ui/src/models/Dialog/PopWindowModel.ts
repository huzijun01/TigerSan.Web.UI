import { computed, ref, shallowRef, watch, type StyleValue } from "vue"
import { Texts } from "../../texts"
import { LanguageBehavior } from "../../helpers"

export class PopWindowModel {
    //#region 【Fields】
    /** 显示时 */
    _onShow?: (model: PopWindowModel) => void
    /** 关闭时 */
    _onClose?: (model: PopWindowModel) => void
    //#endregion 【Fields】

    //#region 【Props】
    /** 是否“显示” */
    readonly IsShow = ref(false)
    /** 标题 */
    readonly Title
    /** “标题”显示文本 */
    readonly ShowTitle
    /** 最小宽度 */
    readonly MinWidth = ref<string | undefined>()
    /** 最小高度 */
    readonly MinHeight = ref<string | undefined>()
    /** 遮罩样式 */
    readonly MaskStyle = shallowRef<StyleValue | undefined>()

    //#region [computed]
    /** 样式 */
    readonly Style = computed((): StyleValue => {
        return {
            minWidth: this.MinWidth.value,
            minHeight: this.MinHeight.value,
        }
    })
    //#endregion [computed]
    //#endregion 【Props】

    //#region 【Ctor】
    constructor() {
        const lbTitle = new LanguageBehavior(Texts.Title)
        this.Title = lbTitle.Text
        this.ShowTitle = lbTitle.ShowText

        watch(this.IsShow, isShow => {
            if (isShow) {
                this._onShow?.(this)
            } else {
                this._onClose?.(this)
            }
        })
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 显示 */
    readonly Show = () => {
        this.IsShow.value = true
    }

    /** 关闭 */
    readonly Close = () => {
        this.IsShow.value = false
    }
    //#endregion 【Functions】
}