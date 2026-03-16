import { nanoid } from 'nanoid'
import { computed, ref } from 'vue'
import { Colors } from '../base'
import { TextModel } from './Text/TextModel'
import { Texts } from '../texts'

type DialogCallback = (state: DialogState, data?: any) => void

enum DialogMode {
    NoButton,
    YesOrNo,
    YesOrCancel
}

enum DialogState {
    Yes,
    No,
    Cancel
}

class DialogModel {
    readonly id: string = nanoid()
    _data?: any
    callback?: DialogCallback

    readonly Title = ref('')
    readonly Msg = ref('')
    readonly NoText = ref('')
    readonly YesText = ref('')
    readonly Color = ref('')
    readonly Mode = ref(DialogMode.NoButton)

    readonly ShowNoText = TextModel.DefaultComputed(this.NoText, Texts.No)
    readonly ShowYesText = TextModel.DefaultComputed(this.YesText, Texts.Yes)
    readonly IsShowButtonPanel = computed(() => this.Mode.value != DialogMode.NoButton)
    readonly IsShowNoButton = computed(() => this.Mode.value === DialogMode.YesOrNo)

    constructor(
        title: string,
        msg: string,
        data?: any,
        callback?: DialogCallback,
        mode: DialogMode = DialogMode.NoButton,
        background: string = Colors.Brand) {
        this.Title.value = title
        this.Msg.value = msg
        this._data = data
        this.callback = callback
        this.Mode.value = mode
        this.Color.value = background
    }
}

export { type DialogCallback, DialogMode, DialogState, DialogModel } 