import { ref } from "vue"
import type { ObjectAction, UnknownGetter, UnknownSetter } from "../../base"
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
    _getValue: UnknownGetter
    _setValue: UnknownSetter
    _isVerifyOk?: FormVerify
    //#endregion 【Fields】

    //#region 【Properties】
    //#region [需手动绑定]
    /** 目标数据
     * （由“FormItemModel”维护，需手动绑定到“表单元素”上） */
    Target = ref<unknown>()
    /** 表单项目模型
     * （由“FormItemModel”传入，需手动绑定到“表单元素”上） */
    ItemModel?: FormItemModel
    /** 修改“源数据”
     * （由“FormItemModel”传入，需在“表单元素”的“值改变时”调用。） */
    SetSource?: (value: unknown) => void
    //#endregion [需手动绑定]

    /** 标题 */
    PropName?: string
    /** 是否“必填” */
    IsEquired?: boolean
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(
        getValue: UnknownGetter,
        setValue: UnknownSetter
    ) {
        this._getValue = getValue
        this._setValue = setValue
    }
    //#endregion 【Ctor】
}

/** 设置“表单模型” */
function SetFormModel(formModel: FormModel, formConfig: FormConfig) {
    // Fields:
    formModel._itemModels = GetItemModels(formModel, formConfig)
    formModel._onSubmit = formModel._onSubmit

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
        const itemModel = new FormItemModel(
            formModel,
            itemConfig._getValue,
            itemConfig._setValue
        )

        // Fields:
        itemModel._isVerifyOk = itemConfig._isVerifyOk

        // Properties:
        itemModel.Target = itemConfig.Target // 覆盖“目标数据”
        if (itemConfig.IsEquired != undefined) itemModel.IsEquired.value = itemConfig.IsEquired
        if (itemConfig.PropName != undefined) itemModel.PropName.value = itemConfig.PropName

        // Functions:
        itemConfig.ItemModel = itemModel // 传入“表单项目模型”
        itemConfig.SetSource = itemModel.SetSource // 传入修改“源数据”方法

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