import { computed, ref } from 'vue'
import { TextBoxModel } from './TextBoxModel'
import { Icons } from '../../base'

class PasswordModel extends TextBoxModel {
    //#region 【Properties】
    IsShowValue = ref(false)

    //#region [computed]
    Type = computed(() => {
        return this.IsShowValue.value ? 'text' : 'password'
    })
    EyeText = computed(() => {
        return this.IsShowValue.value ? Icons.Eye : Icons.Eye_Close
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Functions】
    OnClickEye() {
        this.IsShowValue.value = !this.IsShowValue.value
    }
    //#endregion 【Functions】
}

export {
    PasswordModel
}