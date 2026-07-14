import { computed, ref, watch, type StyleValue } from "vue"

export class PopWindowModel {
    //#region 【Fields】
    /** 显示时 */
    _onShow?: (model: PopWindowModel) => void
    /** 关闭时 */
    _onClose?: (model: PopWindowModel) => void
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否“显示” */
    readonly IsShow = ref(false)
    /** 标题 */
    readonly Title = ref('Title')
    /** 最小宽度 */
    readonly MinWidth = ref<string | undefined>()
    /** 最小高度 */
    readonly MinHeight = ref<string | undefined>()

    //#region [computed]
    /** 样式 */
    readonly Style = computed((): StyleValue => {
        return {
            minWidth: this.MinWidth.value,
            minHeight: this.MinHeight.value,
        }
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor() {
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