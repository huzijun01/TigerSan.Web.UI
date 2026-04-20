import { ref } from "vue"

export class PopWindowModel {
    //#region 【Properties】
    /** 是否“显示” */
    readonly IsShow = ref(false)
    /** 标题 */
    readonly Title = ref('Title')
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
    //#endregion 【Functions】
}