import { ref } from "vue"
import { nanoid } from 'nanoid'
import { PaginationModel } from "./PaginationModel"
import { Int, type Action, type NumberFunc } from "@/0_tigersan_ui/base/types"

class PaginationButtonModel {
    //#region 【Fields】
    _id = nanoid()
    /** 获取“所选数字”
     * （由“PaginationModel”传入） */
    _paginationModel: PaginationModel
    /** “选中后”内部回调
     * （由“PaginationModel”传入） */
    _onCheckedInternal?: Action
    //#endregion 【Fields】

    //#region 【Properties】
    /** 文本 */
    Text = ref('1')
    /** 悬浮文本 */
    HoverText = ref('')
    /** 是否“显示” */
    IsShow = ref(true)
    /** 是否“被选中” */
    IsSelected = ref(false)
    /** 是否“启用” */
    IsEnable = ref(true)

    //#region [引用]
    /** 数字 */
    get Num(): number {
        let int = new Int()
        int.value = Number.parseInt(this.Text.value)
        return int.value
    }
    set Num(int: number) {
        this.Text.value = int.toString()
    }
    //#endregion [引用]
    //#endregion 【Properties】

    //#region 【Events】
    /** 选中后 */
    Checked?: NumberFunc
    //#endregion 【Events】

    //#region 【Ctor】
    constructor(paginationModel: PaginationModel) {
        this._paginationModel = paginationModel
        this._onCheckedInternal = this.NormalButton_OnCheckedInternal
    }
    //#endregion 【Ctor】

    //#region 【回调】
    /** “普通按钮”被选中 */
    private NormalButton_OnCheckedInternal = () => {
        this._paginationModel.SelectedNum.value = this.Num
    }
    //#endregion 【回调】
}

export {
    PaginationButtonModel
}