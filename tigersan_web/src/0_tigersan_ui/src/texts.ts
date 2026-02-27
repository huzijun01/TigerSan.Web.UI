import { TextModel } from "./models"

/** 文本集合 */
class Texts {
    static readonly Count = TextModel.Computed('Count', '总数')
    static readonly To = TextModel.Computed('To', '到')
    static readonly page = TextModel.Computed('page', '页')
    static readonly Select = TextModel.Computed('Select', '选中')
    static readonly Colon = TextModel.Computed(': ', '：')
}

export {
    Texts,
}