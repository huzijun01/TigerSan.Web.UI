import type { StringFunc } from "../../types"
import { ref, computed } from "vue"

class TextBoxModel {
    //#region 【Fields】
    _onChange?: StringFunc
    _onInput?: StringFunc
    //#endregion 【Fields】

    //#region 【Properties】
    readonly Value = ref('')
    readonly Placeholder = ref('')
    readonly Width = ref('')
    readonly IsReadonly = ref(false)

    //#region [computed]
    readonly styleObj = computed(() => {
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

export {
    TextBoxModel
}