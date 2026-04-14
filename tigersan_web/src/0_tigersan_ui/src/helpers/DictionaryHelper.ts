import { IdNameModel } from "../models/SelectModel"
import { IdNameModelHelper } from "../models/IdNameModel"
import { SelectModel } from "../models/Inputs/SelectModel"

export class DictionaryHelper extends IdNameModelHelper<IdNameModel> {
    private _placeholderCN: string
    private _placeholderEN: string

    constructor(action: string, placeholderCN: string, placeholderEN: string) {
        super(action)
        this._placeholderCN = placeholderCN
        this._placeholderEN = placeholderEN
    }

    /** 获取“筛选框模型” */
    GetIdNameSelectModel(): SelectModel<IdNameModel> {
        return super.GetIdNameSelectModel(this._placeholderCN, this._placeholderEN)
    }
}
