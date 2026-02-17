import { type BooleanFunc } from "../../types"
import { computed, ref } from "vue"

class SwitchModel {
    //#region 【Fields】
    _onChange?: BooleanFunc
    //#endregion 【Fields】

    //#region 【Properties】
    Value = ref(false)
    IsEnable = ref(true)
    OnText = ref('ON')
    OffText = ref('OFF')

    //#region [computed]
    Text = computed(() => {
        return this.Value.value ? this.OnText.value : this.OffText.value
    })

    classObj = computed(() => {
        return {
            'on': this.Value.value,
            'disable': !this.IsEnable.value,
        }
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Functions】
    OnClick = () => {
        if (!this.IsEnable.value) return

        this.Value.value = !this.Value.value
        this.OnChange()
    }

    OnChange = () => {
        if (this._onChange) {
            this._onChange(this.Value.value)
        }
    }
    //#endregion 【Functions】
}

export {
    SwitchModel
}