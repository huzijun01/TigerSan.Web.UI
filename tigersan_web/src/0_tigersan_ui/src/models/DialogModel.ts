import { nanoid } from 'nanoid'
import { Colors } from '../base';
import { computed, ref } from 'vue';

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

    readonly Title = ref('')
    readonly Msg = ref('')
    readonly YesText = ref('Yes')
    readonly NoText = ref('No')
    readonly Color = ref('')
    readonly Mode = ref(DialogMode.NoButton)
    data?: any
    callback?: DialogCallback

    IsShowButtonPanel = computed(() => this.Mode.value != DialogMode.NoButton)
    IsShowNoButton = computed(() => this.Mode.value === DialogMode.YesOrNo)

    constructor(
        title: string,
        msg: string,
        data?: any,
        callback?: DialogCallback,
        mode: DialogMode = DialogMode.NoButton,
        background: string = Colors.Brand) {
        this.Title.value = title
        this.Msg.value = msg
        this.data = data
        this.callback = callback
        this.Mode.value = mode
        this.Color.value = background
    }
}

export { type DialogCallback, DialogMode, DialogState, DialogModel } 