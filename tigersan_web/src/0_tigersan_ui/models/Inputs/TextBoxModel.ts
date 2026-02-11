import type { StringFunc } from "@/tigerui"
import { ref, computed } from "vue"

class TextBoxModel {
    //#region 【Fields】
    _onChange?: StringFunc
    _onInput?: StringFunc
    //#endregion 【Fields】

    //#region 【Properties】
    Value = ref('')
    Placeholder = ref('')
    Width = ref('')
    IsReadonly = ref(false)

    //#region [computed]
    styleObj = computed(() => {
        return {
            width: this.Width.value
        }
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Functions】
    OnInput() {
        if (this._onInput) {
            this._onInput(this.Value.value)
        }
    }

    OnChange() {
        if (this._onChange) {
            this._onChange(this.Value.value)
        }
    }

    OnClear() {
        this.Value.value = ''
    }
    //#endregion 【Functions】
}

export {
    TextBoxModel
}