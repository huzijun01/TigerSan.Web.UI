import { nanoid } from 'nanoid'
import { Colors } from '@/0_tigersan_ui/base';

class DialogModel {
    readonly id: string = nanoid()
    title: string
    msg: string
    color: string

    constructor(
        title: string,
        msg: string,
        background: string = Colors.Brand) {
        this.title = title
        this.msg = msg
        this.color = background
    }
}

export { DialogModel } 