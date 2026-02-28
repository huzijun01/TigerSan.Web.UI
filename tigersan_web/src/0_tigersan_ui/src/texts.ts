import { TextModel } from "./text/TextModel"

/** 文本集合 */
class Texts {
    static readonly Count = TextModel.Computed('Count', '总数')
    static readonly To = TextModel.Computed('To', '到')
    static readonly page = TextModel.Computed('page', '页')
    static readonly Select = TextModel.Computed('Select', '选中')
    static readonly Colon = TextModel.Computed(': ', '：')
    static readonly PleaseSelect = TextModel.Computed('Please select.', '请选择')
}

export {
    Texts,
}