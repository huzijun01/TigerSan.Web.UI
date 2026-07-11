import { nanoid } from 'nanoid'
import { computed, ref, type ComputedRef } from 'vue'
import { Texts } from '../texts'
import { Colors } from '../base'
import { LanguageBehavior } from '../helpers'

export type DialogCallback = (state: DialogState, data?: any) => any

/** “弹窗”模式 */
export enum DialogMode {
    NoButton,
    YesOrNo,
    YesOrCancel
}

/** “弹窗”状态 */
export enum DialogState {
    Yes,
    No,
    Cancel
}

/** “弹窗”模型 */
export class DialogModel {
    //#region 【Fields】
    readonly id: string = nanoid()
    _data?: any
    callback?: DialogCallback
    //#endregion 【Fields】

    //#region 【Properties】
    /** “标题”文本 */
    readonly Title
    /** “No”文本 */
    readonly NoText
    /** “Yes”文本 */
    readonly YesText
    /** 消息 */
    readonly Msg = ref('')
    /** 颜色 */
    readonly Color = ref('')
    /** 模式 */
    readonly Mode = ref(DialogMode.NoButton)

    //#region [computed]
    /** “标题”显示文本 */
    readonly ShowTitle
    /** “No”显示文本 */
    readonly ShowNoText
    /** “Yes”显示文本 */
    readonly ShowYesText
    readonly IsShowButtonPanel = computed(() => this.Mode.value != DialogMode.NoButton)
    readonly IsShowNoButton = computed(() => this.Mode.value === DialogMode.YesOrNo)
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(
        title: string | ComputedRef<string>,
        msg: string,
        data?: any,
        callback?: DialogCallback,
        mode: DialogMode = DialogMode.NoButton,
        background: string = Colors.Brand) {
        this._data = data
        this.Msg.value = msg
        this.Mode.value = mode
        this.Color.value = background
        this.callback = callback

        const lbTitle = new LanguageBehavior(title)
        this.Title = lbTitle.Text
        this.ShowTitle = lbTitle.ShowText

        const lbNo = new LanguageBehavior(Texts.No)
        this.NoText = lbNo.Text
        this.ShowNoText = lbNo.ShowText

        const lbYes = new LanguageBehavior(Texts.Yes)
        this.YesText = lbYes.Text
        this.ShowYesText = lbYes.ShowText
    }
    //#endregion 【Ctor】
}