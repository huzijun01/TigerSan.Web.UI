import { ref } from "vue"
import type { StringArrayFunc } from "../../types"
import { nanoid } from "nanoid"

class CheckboxModel {
    //#region 【Fields】
    _id = nanoid()
    _onChange?: (model: CheckboxModel) => void
    //#endregion 【Fields】

    //#region 【Properties】
    readonly IsChecked = ref(false)
    readonly Value = ref<string>()
    readonly Text = ref('')
    readonly IsReadonly = ref(false)
    //#endregion 【Properties】

    //#region 【Functions】
    readonly OnChange = () => {
        if (this._onChange) {
            this._onChange(this)
        }
    }
    //#endregion 【Functions】
}

class CheckboxGroupModel {
    //#region 【Fields】
    _onChange?: StringArrayFunc
    //#endregion 【Fields】

    //#region 【Properties】
    readonly Values = ref<Array<string>>([])
    //#endregion 【Properties】

    //#region 【Functions】
    readonly OnChange = () => {
        if (this._onChange) {
            this._onChange(this.Values.value)
        }
    }
    //#endregion 【Functions】
}

export {
    CheckboxModel,
    CheckboxGroupModel,
}