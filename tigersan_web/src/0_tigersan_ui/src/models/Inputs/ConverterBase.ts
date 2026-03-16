import { ref, watch } from "vue"
import { StringHelper } from "../../helpers"
import type { Any2StringFunc } from "../../types"

/** “值转换控件”基类 */
class ConverterBase<T> {
    //#region 【Fields】
    /** 转换器 */
    _converter?: Any2StringFunc
    //#endregion 【Fields】

    //#region 【Properties】
    /** 值 */
    readonly Value = ref<T | undefined>()
    /** 文本 */
    readonly Text = ref('')
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor() {
        watch(this.Value, this.UpdateText)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    //#region [private]
    /** 获取“文本” */
    private readonly GetText = () => {
        if (this.Value.value === undefined) return ''

        let text = ''

        if (this._converter) {
            text = this._converter(this.Value.value)
        }
        else {
            text = new String(this.Value.value).toString()
        }

        return text
    }
    //#endregion [private]

    /** 更新“文本” */
    readonly UpdateText = () => {
        this.Text.value = this.GetText()
    }

    /** 是否“模糊包含” */
    IsFuzzyIncludes(search: string): boolean {
        return StringHelper.IsFuzzyIncludes(this.GetText(), search)
    }
    //#endregion 【Functions】
}

export {
    ConverterBase
}