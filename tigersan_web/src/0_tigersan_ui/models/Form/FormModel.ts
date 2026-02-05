import { ref, computed, watch } from "vue"
import { Colors } from "@/0_tigersan_ui/base"
import type { ObjectAction, UnknownGetter, UnknownSetter } from "@/0_tigersan_ui/base"
import { dialog } from '@/0_tigersan_ui/stores'
import { FormConfig, SetFormModel, GetItemModels } from './FormConfig'

type FormVerify = (source: object) => VerifyResult
type FormSubmit = (source: object) => SubmitResult

/** 表单结果 */
enum FormResult {
    OK,
    Error,
    Warning,
}

/** 验证结果 */
class VerifyResult {
    VerifyState: FormResult
    VerifyText: string

    constructor(
        verifyText: string = '',
        verifyState: FormResult = FormResult.OK
    ) {
        this.VerifyText = verifyText
        this.VerifyState = verifyState
    }
}

/** 提交结果 */
class SubmitResult {
    Msg: string
    Result: FormResult

    constructor(
        msg: string = '',
        res: FormResult = FormResult.OK
    ) {
        this.Msg = msg
        this.Result = res
    }
}

/** 表单模型 */
class FormModel {
    //#region 【Fields】
    /** 源数据
     * （由“FormModel”内部维护） */
    _source: object
    /** “表单项目模型”集合 */
    _itemModels = new Array<FormItemModel>()
    /** 获取“源数据”  */
    _getSource: ObjectAction
    /** 提交时 */
    _onSubmit?: FormSubmit
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
    constructor(config: FormConfig) {
        this._getSource = config._getSource
        this._source = this._getSource()
        SetFormModel(this, config)

        // 显示时初始化:
        watch(this.IsShow, () => {
            this.InitData()
            this.InitVerifyState()
        })
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 遍历“项目模型”集合 */
    private ForEachItemModels(fn: (itemModel: FormItemModel) => void) {
        for (let index = 0; index < this._itemModels.length; index++) {
            const itemModel = this._itemModels[index]

            if (!itemModel) {
                console.log('The itemModel is undefined!')
                continue
            }

            fn(itemModel)
        }
    }

    /** 初始化“验证状态”
     * （“Form”显示后会自动调用） */
    private InitVerifyState = () => {
        this.ForEachItemModels(itemModel => {
            itemModel.VerifyText.value = ''
            itemModel.VerifyResult.value = FormResult.OK
        })
    }

    /** 初始化“源数据”
     * （“Form”显示后会自动调用） */
    private InitData = () => {
        // 获取“源数据”:
        this._source = this._getSource()

        // 更新“目标数据”:
        this.UpdateTargets()
    }

    /** 显示 */
    Show = () => {
        this.IsShow.value = true
    }

    /** 关闭 */
    Close = () => {
        this.IsShow.value = false
    }

    /** 提交 */
    OnSubmit = () => {
        // 验证有误:
        if (!this.IsVerifyOk()) return

        // 无操作:
        if (!this._onSubmit) {
            this.Close()
            return
        }

        // 提交:
        const res = this._onSubmit(this._source)

        // 显示结果:
        switch (res.Result) {
            case FormResult.Error:
                dialog.ShowError(res.Msg)
                return
            case FormResult.Warning:
                dialog.ShowWarning(res.Msg)
                break
            default:
                dialog.ShowSuccess(res.Msg)
                break
        }

        // 关闭:
        this.Close()
    }

    /** 更新“目标数据”集合 */
    UpdateTargets() {
        this.ForEachItemModels(itemModel => {
            itemModel.UpdateTarget()
        })
    }

    /** 是否验证成功
     * （“Form”提交时会自动调用） */
    IsVerifyOk = () => {
        let isOk = true

        this.ForEachItemModels(itemModel => {
            if (!itemModel._isVerifyOk) return

            var res = itemModel._isVerifyOk(this._source)

            if (res.VerifyState != FormResult.OK) {
                itemModel.VerifyText.value = res.VerifyText
                itemModel.VerifyResult.value = FormResult.Error
                isOk = false
            }
            else {
                itemModel.VerifyText.value = ''
                itemModel.VerifyResult.value = FormResult.OK
            }
        })

        return isOk
    }
    //#endregion 【Functions】
}

/** 表单项目模型 */
class FormItemModel {
    //#region 【Fields】
    _formModel: FormModel
    _getValue: UnknownGetter
    _setValue: UnknownSetter
    _isVerifyOk?: FormVerify
    //#endregion 【Fields】

    //#region 【Properties】
    //#region [内部维护]
    /** 目标数据：
     * 会被“FormItemConfig”覆盖
     * （由“FormItemModel”维护） */
    Target = ref<unknown>()
    /** 验证结果
     * （由“FormItemModel”维护） */
    VerifyResult = ref(FormResult.OK)
    /** 验证文本
     * （由“FormItemModel”维护） */
    VerifyText = ref('')
    //#endregion [内部维护]

    /** 标题 */
    PropName = ref('PropName')
    /** 是否“必填” */
    IsEquired = ref(false)

    //#region [computed]
    /** 是否显示“验证文本” */
    IsShowVerify = computed(() => {
        return this.VerifyText.value.trim() != ''
    })

    /** “验证文本”颜色 */
    VerifyColor = computed(() => {
        let color = ''
        switch (this.VerifyResult.value) {
            case FormResult.Error:
                color = Colors.Danger
                break
            case FormResult.Warning:
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
    constructor(
        formModel: FormModel,
        getValue: UnknownGetter,
        setValue: UnknownSetter
    ) {
        this._formModel = formModel
        this._getValue = getValue
        this._setValue = setValue
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 修改“源数据”
     * （会更新状态，需手动调用） */
    SetSource = (value: unknown) => {
        if (!this._setValue) return
        // 修改“源数据”:
        this._setValue(this._formModel._source, value)
        // 修改“目标数据”:
        this.Target.value = value
        // 验证:
        this.IsVerifyOk()
    }

    /** 更新“目标数据” */
    UpdateTarget() {
        this.Target.value = this._getValue(this._formModel._source)
    }

    /** 是否验证成功
     * （“FormItem”修改“源数据”时会自动调用） */
    IsVerifyOk = (): boolean => {
        if (!this._isVerifyOk) return true

        var res = this._isVerifyOk(this._formModel._source)

        if (res.VerifyState != FormResult.OK) {
            this.VerifyText.value = res.VerifyText
            this.VerifyResult.value = FormResult.Error
            return false
        } else {
            this.VerifyText.value = ''
            this.VerifyResult.value = FormResult.OK
            return true
        }
    }
    //#endregion 【Functions】
}

export {
    type FormVerify,
    type FormSubmit,
    FormResult,
    VerifyResult,
    SubmitResult,
    FormModel,
    FormItemModel
}