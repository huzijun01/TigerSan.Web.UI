import { ref } from 'vue'
import { TextBoxModel } from './TextBoxModel'
import type { StringFunc } from '../../types'

class SearchModel extends TextBoxModel {
    //#region 【Fields】
    _onSearch?: StringFunc
    //#endregion 【Fields】

    //#region 【Properties】
    IsShowValue = ref(false)
    //#endregion 【Properties】

    //#region 【Functions】
    OnSearch() {
        if (this._onSearch) {
            this._onSearch(this.Value.value)
        }
    }
    //#endregion 【Functions】
}

export {
    SearchModel
}