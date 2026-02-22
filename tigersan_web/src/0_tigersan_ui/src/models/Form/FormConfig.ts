import { ref, type Ref } from "vue"
import type { ObjectAction, UnknownGetter, UnknownSetter, UnknownFunc } from "../../types"
import { type FormVerify, type FormSubmit, FormModel, FormItemModel } from "./FormModel"

/** 表单配置 */
class FormConfig {
    //#region 【Fields】
    /** “表单项目配置”集合 */
    _itemConfigs?: FormItemConfig[]
    /** “源数据获取”方法  */
    _getSource: ObjectAction
    /** 提交时 */
    _onSubmit?: FormSubmit
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否“显示” */
    IsShow?: boolean
    /** 标题 */
    Title?: string
    /** “提交”文本 */
    CancelText?: string
    /** “提交”文本 */
    SubmitText?: string
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(getSource: ObjectAction) {
        this._getSource = getSource
    }
    //#endregion 【Ctor】
}

/** 表单项目配置 */
class FormItemConfig {
    //#region 【Fields】
    /** 属性名 */
    _propName: string
    /** “属性名”垂直对齐 */
    _propNameVerticalAlign?: string
    /** Getter */
    _getValue?: UnknownGetter
    _setValue?: UnknownSetter
    /** 改变后 */
    _onChange?: UnknownFunc
    /** 是否“验证无误” */
    _isVerifyOk?: FormVerify
    //#endregion 【Fields】

    //#region 【Properties】
    //#region [需手动绑定]
    /** 目标数据
     * （需手动绑定到“表单元素”上） */
    Target: Ref<unknown> = ref<unknown>()
    /** 表单项目模型
     * （由“FormItemModel”传入，需手动绑定到“表单元素”上） */
    ItemModel?: FormItemModel
    //#endregion [需手动绑定]

    /** 属性文本 */
    PropText?: string
    /** 是否“必填” */
    IsEquired?: boolean
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(propName: string, target?: Ref<unknown>) {
        this._propName = propName
        if (target != undefined) this.Target = target
    }
    //#endregion 【Ctor】
}

/** 设置“表单模型” */
function SetFormModel(formModel: FormModel, formConfig: FormConfig) {
    // Fields:
    formModel._itemModels = GetItemModels(formModel, formConfig)
    formModel._onSubmit = formConfig._onSubmit

    // Properties:
    if (formConfig.IsShow != undefined) formModel.IsShow.value = formConfig.IsShow
    if (formConfig.Title != undefined) formModel.Title.value = formConfig.Title
    if (formConfig.CancelText != undefined) formModel.CancelText.value = formConfig.CancelText
    if (formConfig.SubmitText != undefined) formModel.SubmitText.value = formConfig.SubmitText
}

/** 获取“表单项目模型”集合 */
function GetItemModels(formModel: FormModel, formConfig: FormConfig): FormItemModel[] {
    if (!formConfig._itemConfigs) return []

    let itemModels = new Array<FormItemModel>()

    formConfig._itemConfigs.forEach(itemConfig => {
        // create:
        const itemModel = new FormItemModel(formModel, itemConfig._propName, itemConfig.Target)

        // Fields:
        if (itemConfig._propNameVerticalAlign != undefined) itemModel._propNameVerticalAlign = itemConfig._propNameVerticalAlign
        if (itemConfig._getValue != undefined) itemModel._getValue = itemConfig._getValue
        if (itemConfig._setValue != undefined) itemModel._setValue = itemConfig._setValue
        itemModel._onChange = itemConfig._onChange
        itemModel._isVerifyOk = itemConfig._isVerifyOk

        // Properties:
        if (itemConfig.IsEquired != undefined) itemModel.IsEquired.value = itemConfig.IsEquired
        if (itemConfig.PropText != undefined) itemModel.PropText.value = itemConfig.PropText

        // Functions:
        itemConfig.ItemModel = itemModel // 传入“表单项目模型”

        // push:
        itemModels.push(itemModel)
    })

    return itemModels
}

export {
    FormConfig,
    FormItemConfig,
    SetFormModel,
    GetItemModels,
}