import { computed, ref, type StyleValue } from "vue"

export class PopWindowModel {
    //#region 【Properties】
    /** 是否“显示” */
    readonly IsShow = ref(false)
    /** 标题 */
    readonly Title = ref('Title')
    /** 最小宽度 */
    readonly MinWidth = ref<string | undefined>()
    /** 最小高度 */
    readonly MinHeight = ref<string | undefined>()
    //#endregion 【Properties】

    //#region 【Functions】
    /** 显示 */
    readonly Show = () => {
        this.IsShow.value = true
    }

    /** 关闭 */
    readonly Close = () => {
        this.IsShow.value = false
    }

    /** 样式 */
    readonly Style = computed((): StyleValue => {
        return {
            minWidth: this.MinWidth.value,
            minHeight: this.MinHeight.value,
        }
    })
    //#endregion 【Functions】
}