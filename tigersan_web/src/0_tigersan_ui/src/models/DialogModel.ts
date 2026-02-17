import { nanoid } from 'nanoid'
import { Colors } from '../base';
import { computed, ref } from 'vue';

type DialogCallback = (state: DialogState) => void

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

    Title = ref('')
    Msg = ref('')
    YesText = ref('Yes')
    NoText = ref('No')
    Color = ref('')
    Mode = ref(DialogMode.NoButton)
    callback?: DialogCallback

    IsShowButtonPanel = computed(() => this.Mode.value != DialogMode.NoButton)
    IsShowNoButton = computed(() => this.Mode.value === DialogMode.YesOrNo)

    constructor(
        title: string,
        msg: string,
        callback?: DialogCallback,
        mode: DialogMode = DialogMode.NoButton,
        background: string = Colors.Brand) {
        this.Title.value = title
        this.Msg.value = msg
        this.callback = callback
        this.Mode.value = mode
        this.Color.value = background
    }
}

export { type DialogCallback, DialogMode, DialogState, DialogModel } 