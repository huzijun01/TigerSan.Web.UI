import { ref, computed, watch } from "vue"
import { Colors } from "@/0_tigersan_ui/base"
import type { ObjectAction } from "@/0_tigersan_ui/base"

enum VerifyStates {
    OK,
    Error,
    Warning,
}

class VerifyResult {
    VerifyState: VerifyStates
    VerifyText: string
    constructor(
        verifyText: string = '',
        verifyState: VerifyStates = VerifyStates.OK) {
        this.VerifyText = verifyText
        this.VerifyState = verifyState
    }
}

/** 表单模型 */
class FormModel {
    //#region 【Fields】
    /** 提交时 */
    _onSubmit?: Function
    /** 源数据
     * （由“FormModel”内部维护） */
    _source: object
    /** “表单项目模型”集合 */
    _itemModels = new Array<FormItemModel>()
    /** 获取“源数据”  */
    _getSource: ObjectAction
    /** 获取“源数据”默认方法  */
    static _defaultGetSource: ObjectAction = () => { return {} }
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否“显示” */
    IsShow = ref(false)
    /** 标题 */
    Title = ref('Title')
    /** “提交”文本 */
    CancelText = ref('Cancel')
    /** “提交”文本 */
    SubmitText = ref('Submit')
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(getSource: ObjectAction = FormModel._defaultGetSource) {
        this._getSource = getSource
        this._source = this._getSource()
        watch(this.IsShow, () => {
            this.InitData()
            this.InitVerifyState()
        })
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 显示 */
    Show = () => {
        this.IsShow.value = true
    }
    /** 关闭 */
    Close = () => {
        this.IsShow.value = false
    }
    /** 初始化“源数据”
     * （“Form”显示后会自动调用） */
    InitData = () => {
        this._source = this._getSource()
    }
    /** 初始化“验证状态”
     * （“Form”显示后会自动调用） */
    InitVerifyState = () => {
        for (let index = 0; index < this._itemModels.length; index++) {
            const itemModel = this._itemModels[index]

            if (!itemModel) {
                console.log('The itemModel is undefined!')
                continue
            }

            itemModel.VerifyText.value = ''
            itemModel.VerifyResult.value = VerifyStates.OK
        }
    }
    /** 是否验证成功
     * （“Form”提交时会自动调用） */
    IsVerifyOk = () => {
        let isOk = true

        for (let index = 0; index < this._itemModels.length; index++) {
            const itemModel = this._itemModels[index]

            if (!itemModel) {
                console.log('The itemModel is undefined!')
                continue
            }

            if (!itemModel._isVerifyOk) return

            var res = itemModel._isVerifyOk(this._source)

            if (res.VerifyState != VerifyStates.OK) {
                itemModel.VerifyText.value = res.VerifyText
                itemModel.VerifyResult.value = VerifyStates.Error
                isOk = false
            }
            else {
                itemModel.VerifyText.value = ''
                itemModel.VerifyResult.value = VerifyStates.OK
            }
        }

        return isOk
    }
    //#endregion 【Functions】
}

/** 表单项目模型 */
class FormItemModel {
    //#region 【Fields】
    _formModel: FormModel
    _getValue?: ObjectAction
    _setValue?: (source: object, value: unknown) => void
    _isVerifyOk?: (source: object) => VerifyResult
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否“必填” */
    IsEquired = ref(false)
    /** 标题 */
    PropName = ref('PropName')
    /** 验证文本 */
    VerifyText = ref('')
    /** 验证结果 */
    VerifyResult = ref(VerifyStates.OK)

    //#region [computed]
    /** 是否显示“验证文本” */
    IsShowVerify = computed(() => {
        return this.VerifyText.value.trim() != ''
    })
    /** “验证文本”颜色 */
    VerifyColor = computed(() => {
        let color = ''
        switch (this.VerifyResult.value) {
            case VerifyStates.Error:
                color = Colors.Danger
                break
            case VerifyStates.Warning:
                color = Colors.Warning
                break
            default:
                color = Colors.Success
                break
        }
        return color
    })
    /** “验证文本”样式对象 */
    verifyStyleObj = computed(() => {
        return {
            color: this.VerifyColor.value
        }
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(formModel: FormModel) {
        this._formModel = formModel
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 修改“源数据”
     * （会更新状态，需手动调用） */
    SetSource = (value: unknown) => {
        if (!this._setValue) return
        this._setValue(this._formModel._source, value)
        this.IsVerifyOk()
    }
    /** 是否验证成功
     * （“FormItem”修改“源数据”时会自动调用） */
    IsVerifyOk = () => {
        if (!this._isVerifyOk) return true

        var res = this._isVerifyOk(this._formModel._source)

        if (res.VerifyState != VerifyStates.OK) {
            this.VerifyText.value = res.VerifyText
            this.VerifyResult.value = VerifyStates.Error
            return false
        }

        this.VerifyText.value = ''
        this.VerifyResult.value = VerifyStates.OK
        return true
    }
    //#endregion 【Functions】
}

export { VerifyStates, VerifyResult, FormModel, FormItemModel }