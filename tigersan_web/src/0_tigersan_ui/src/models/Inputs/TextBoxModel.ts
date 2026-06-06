import { ref, computed } from "vue"
import { Texts } from "../../texts"
import { TextModel } from "../Text/TextModel"
import type { StringFunc } from "../../types"

export class TextBoxModel {
    //#region 【Fields】
    _onChange?: StringFunc
    _onInput?: StringFunc
    //#endregion 【Fields】

    //#region 【Properties】
    readonly Value = ref('')
    readonly Width = ref('208px')
    readonly IsReadonly = ref(false)
    /** 占位文本（英文） */
    readonly PlaceholderEN = ref('')
    /** 占位文本（中文） */
    readonly PlaceholderCN = ref('')

    //#region [computed]
    /** 显示的“占位文本” */
    readonly ShowPlaceholder = TextModel.DefaultComputed(this.PlaceholderEN, this.PlaceholderCN, Texts.PleaseEnter)

    /** “宽度”样式 */
    readonly WidthStyle = computed(() => {
        return {
            width: this.Width.value,
        }
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Functions】
    readonly OnInput = () => {
        if (this._onInput) {
            this._onInput(this.Value.value)
        }
    }

    readonly OnChange = () => {
        if (this._onChange) {
            this._onChange(this.Value.value)
        }
    }

    readonly OnClear = () => {
        this.Value.value = ''
        this.OnChange()
    }
    //#endregion 【Functions】
}