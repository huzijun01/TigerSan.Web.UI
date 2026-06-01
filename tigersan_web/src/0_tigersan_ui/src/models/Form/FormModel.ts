import { ref, computed, watch, type Ref, type StyleValue } from "vue"
import { Colors } from "../../base"
import { DialogHelper } from '../../stores'
import { ObjectHelper } from "../../helpers"
import { loading } from "../Dialog/LoadingModel"
import { FormConfig, SetFormModel } from './FormConfig'
import type { TObjectAction, TGetter, TSetter, UnknownChange } from "../../types"

export type FormVerify<TSource extends object> = (source: TSource, isEdit: boolean) => VerifyResult
export type FormSubmit<TSource extends object> = (source: TSource, isEdit: boolean) => SubmitResult
export type FormSubmitAsync<TSource extends object> = (source: TSource, isEdit: boolean) => Promise<SubmitResult>

/** 填充配置 */
export type FillOpts = {
    /** 是否填充“中心”。默认值：auto */
    center?: boolean
    /** 是否填充“上部”。默认值：0px */
    top?: boolean
    /** 是否填充“下部”。默认值：0px */
    bottom?: boolean
    /** 是否填充“左侧”。默认值：0px */
    left?: boolean
    /** 是否填充“右侧”。默认值：0px */
    right?: boolean
}

/** 表单结果 */
export enum FormResult {
    OK,
    Error,
    Warning,
}

/** 验证结果 */
export class VerifyResult {
    VerifyState: FormResult
    VerifyText: string

    constructor(
        verifyText: string = '',
        verifyState: FormResult = FormResult.OK
    ) {
        this.VerifyText = verifyText
        this.VerifyState = verifyState
    }

    IsOK() {
        return this.VerifyState === FormResult.OK
    }

    IsWarning() {
        return this.VerifyState === FormResult.Warning
    }

    IsError() {
        return this.VerifyState === FormResult.Error
    }
}

/** 提交结果 */
export class SubmitResult {
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
export class FormModel<TSource extends object> {
    //#region 【Fields】
    /** 是否“为编辑” */
    _isEdit = false
    /** 是否“显示结果” */
    _isShowResult = true
    /** 是否“显示成功结果” */
    _isShowSuccessResult = true
    /** 源数据
     * （由“FormModel”内部维护） */
    _source: TSource
    /** “表单项目模型”集合
     * （由“FormModel”内部维护） */
    _itemModels = new Array<FormItemModel<TSource, any>>()
    /** 关闭后 */
    _onClose?: Function
    /** 获取“源数据”  */
    _getSource: TObjectAction<TSource>
    /** 提交时 */
    _onSubmit?: FormSubmit<TSource>
    /** 提交时（异步） */
    _onSubmitAsync?: FormSubmitAsync<TSource>
    /** 初始化前 */
    _beforeInit?: (isEdit: boolean) => void
    /** 初始化前（异步）：优先执行该方法 */
    _beforeInitAsync?: (isEdit: boolean) => Promise<void>
    /** 初始化后 */
    _onInit?: (isEdit: boolean) => void
    /** 初始化后（异步）：优先执行该方法 */
    _onInitAsync?: (isEdit: boolean) => Promise<void>
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否“显示” */
    readonly IsShow = ref(false)
    /** 标题 */
    readonly Title = ref('Title')
    /** “提交”文本 */
    readonly CancelText = ref('Cancel')
    /** “提交”文本 */
    readonly SubmitText = ref('Submit')
    /** 最小宽度 */
    readonly MinWidth = ref<string | undefined>()
    /** 最小高度 */
    readonly MinHeight = ref<string | undefined>()
    /** 填充配置 */
    readonly FillOpts = ref<FillOpts | undefined>()
    /** “表单容器”样式对象 */
    readonly FormPanelStyle = computed((): StyleValue => {
        return {
            minWidth: this.MinWidth.value,
            minHeight: this.MinHeight.value,
        }
    })
    /** “内容容器”样式对象 */
    readonly ContentPanelStyle = computed((): StyleValue => {
        const opts = this.FillOpts.value
        if (!opts) return

        function size(opt?: boolean, isCenter: boolean = false) {
            if (opt === undefined) return isCenter ? 'auto' : '0px'
            return opt ? '1fr' : 'auto'
        }

        const gridTemplateRows = `${size(opts.top)} ${size(opts.center, true)} ${size(opts.bottom)}`
        const gridTemplateColumns = `${size(opts.left)} ${size(opts.center, true)} ${size(opts.right)}`

        return {
            gridTemplateRows,
            gridTemplateColumns,
        }
    })
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(config: FormConfig<TSource>) {
        // 初始化“字段”:
        this._getSource = config._getSource
        this._source = this._getSource()
        SetFormModel(this, config)

        // 更新“目标数据”:
        this.UpdateTargets()

        // 显示时初始化:
        watch(this.IsShow, isShow => {
            if (isShow) {
                this.Init()
            } else {
                this._onClose?.()
            }
        })
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    //#region [private]
    /** 遍历“项目模型”集合 */
    private ForEachItemModels<TTarget>(fn: (itemModel: FormItemModel<TSource, TTarget>) => void) {
        for (let index = 0; index < this._itemModels.length; index++) {
            const itemModel = this._itemModels[index]

            if (!itemModel) {
                console.warn('The itemModel is undefined!')
                continue
            }

            fn(itemModel)
        }
    }

    /** 显示结果 */
    private ShowResult(res: SubmitResult) {
        if (this._isShowResult) {
            switch (res.Result) {
                case FormResult.Error:
                    DialogHelper.ShowError(res.Msg)
                    return
                case FormResult.Warning:
                    DialogHelper.ShowWarning(res.Msg)
                    break
                default:
                    if (this._isShowSuccessResult) {
                        DialogHelper.ShowSuccess(res.Msg)
                    }
                    break
            }
        }
    }

    /** 合并“多个结果” */
    private GetResult(arr: SubmitResult[]): SubmitResult {
        const res = new SubmitResult()

        if (arr.some(r => r.Result === FormResult.Error)) {
            res.Result = FormResult.Error
        } else if (arr.some(r => r.Result === FormResult.Warning)) {
            res.Result = FormResult.Warning
        }

        arr.forEach(r => {
            res.Msg += r.Msg + '\r\n'
        })

        return res
    }

    /** 显示多个结果 */
    private ShowResultRange(arr: SubmitResult[]): SubmitResult {
        const res = this.GetResult(arr)
        this.ShowResult(res)
        return res
    }
    //#endregion [private]

    /** 初始化
     * （“Form”显示后会自动调用） */
    readonly Init = async () => {
        try {
            loading.IsShow.value = true

            const init = () => {
                // 获取“源数据”:
                this._source = this._getSource()
                // 更新“目标数据”:
                this.UpdateTargets()
                // 初始化“验证状态”:
                this.InitVerifyState()
            }

            if (this._beforeInitAsync) {
                await this._beforeInitAsync(this._isEdit)
                    .then(init)
            } else {
                this._beforeInit?.(this._isEdit)
                init()
            }

            if (this._onInitAsync) {
                await this._onInitAsync(this._isEdit)
            } else {
                this._onInit?.(this._isEdit)
            }
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 初始化“验证状态”
     * （“Form”显示后会自动调用） */
    readonly InitVerifyState = () => {
        this.ForEachItemModels(itemModel => {
            itemModel.VerifyText.value = ''
            itemModel.VerifyResult.value = FormResult.OK
        })
    }

    /** 更新“目标数据”集合 */
    readonly UpdateTargets = () => {
        this.ForEachItemModels(itemModel => {
            itemModel.UpdateTarget()
        })
    }

    /** 显示 */
    readonly Show = (isEdit: boolean = false) => {
        this._isEdit = isEdit
        this.IsShow.value = true
    }

    /** 关闭 */
    readonly Close = () => {
        this.IsShow.value = false
    }

    /** 提交 */
    readonly OnSubmit = async () => {
        // 验证有误:
        if (!this.IsVerifyOk()) return

        // 无操作:
        if (!this._onSubmit && !this._onSubmitAsync) {
            this.Close()
            return
        }

        // 提交:
        const results = new Array<SubmitResult>()

        try {
            loading.IsShow.value = true

            if (this._onSubmit) {
                results.push(this._onSubmit(this._source, this._isEdit))
            }

            if (this._onSubmitAsync) {
                results.push(await this._onSubmitAsync(this._source, this._isEdit))
            }
        } finally {
            loading.IsShow.value = false
        }

        // 显示结果:
        const res = this.ShowResultRange(results)

        if (res.Result != FormResult.Error) {
            // 关闭:
            this.Close()
        }
    }

    /** 是否验证成功
     * （“Form”提交时会自动调用） */
    readonly IsVerifyOk = () => {
        let isOk = true

        this.ForEachItemModels(itemModel => {
            if (!itemModel._isVerifyOk) return

            var res = itemModel._isVerifyOk(this._source, this._isEdit)

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
export class FormItemModel<TSource extends object, TTarget> {
    //#region 【Fields】
    /** 属性名 */
    _propName: string
    /** “属性名”垂直对齐 */
    _propNameVerticalAlign = 'middle'
    /** 所属“表单模型” */
    _formModel: FormModel<TSource>
    /** “源数据”getter */
    _getValue: TGetter<TSource, TTarget | undefined> = ObjectHelper.DefaultTGetter<TTarget | undefined>
    /** “源数据”setter */
    _setValue: TSetter<TSource, TTarget | undefined> = ObjectHelper.DefaultTSetter<TTarget | undefined>
    /** 改变后 */
    _onChange?: UnknownChange
    /** 是否“验证无误” */
    _isVerifyOk?: FormVerify<TSource>
    //#endregion 【Fields】

    //#region 【Properties】
    //#region [内部维护]
    /** 目标数据
     * （值改变时，会执行“OnChange”） */
    readonly Target: Ref<TTarget | undefined>
    /** 验证结果
     * （由“FormItemModel”维护） */
    readonly VerifyResult = ref(FormResult.OK)
    /** 验证文本
     * （由“FormItemModel”维护） */
    readonly VerifyText = ref('')
    //#endregion [内部维护]

    /** 属性文本 */
    readonly PropText = ref('')
    /** 是否“必填” */
    readonly IsEquired = ref(false)

    //#region [computed]
    /** 是否显示“属性名” */
    readonly IsShowPropName = computed(() => {
        return this.PropText.value.trim() != ''
    })

    /** 是否显示“验证文本” */
    readonly IsShowVerify = computed(() => {
        return this.VerifyText.value.trim() != ''
    })

    /** “验证文本”颜色 */
    readonly VerifyColor = computed(() => {
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

    /** “属性名”样式对象 */
    readonly propNameStyleObj = computed(() => {
        return {
            verticalAlign: this._propNameVerticalAlign
        }
    })

    /** “验证文本”样式对象 */
    readonly verifyStyleObj = computed(() => {
        return {
            color: this.VerifyColor.value
        }
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(
        formModel: FormModel<TSource>,
        propName: string,
        target: Ref<TTarget | undefined>,
    ) {
        this._formModel = formModel
        this._propName = propName
        this.Target = target

        // 监听:
        watch(this.Target, this.OnChange)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 更新“目标数据” */
    async UpdateTarget() {
        // 检验“属性是否存在”:
        if (this._propName === '') {
            return
        }
        else if (!(this._propName in this._formModel._source)) {
            console.warn(`The _source does not contain the ${this._propName} field!`)
            return
        }

        // 修改“目标数据”:
        this.Target.value = this._getValue(this._formModel._source, this._propName)
    }

    /** 修改“源数据”
     * （“Target”改变时，会自动调用） */
    readonly OnChange = (value: TTarget | undefined, oldValue: TTarget | undefined) => {
        // 检验“属性是否存在”:
        if (this._propName === '') {
            return
        }
        else if (!(this._propName in this._formModel._source)) {
            console.warn(`The _source does not contain the ${this._propName} field!`)
            return
        }

        if (!this._setValue) return

        // 修改“源数据”:
        this._setValue(this._formModel._source, this._propName, value)

        // 执行“改变后”回调:
        if (this._onChange) {
            this._onChange(value, oldValue)
        }

        // 验证:
        this.IsVerifyOk()
    }

    /** 是否验证成功
     * （“FormItem”修改“源数据”时会自动调用） */
    readonly IsVerifyOk = (): boolean => {
        if (!this._isVerifyOk) return true

        var res = this._isVerifyOk(this._formModel._source, this._formModel._isEdit)

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