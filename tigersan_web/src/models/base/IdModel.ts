import { AxiosHelper } from "@/helpers"

/** "组织机构"模型 */
export class IdModel {
    readonly id: number = 0
}

export class IdModelHelper<TModel extends IdModel> {
    readonly _action: string

    constructor(action: string) {
        this._action = action
    }

    // 查:
    readonly GetCount = async () => await AxiosHelper.GetCount(this._action)
    readonly GetAllList = async () => await AxiosHelper.GetAllList<TModel>(this._action)
    readonly GetList = async (pageSize: number, pageNumber: number) => await AxiosHelper.GetList<TModel>(this._action, pageSize, pageNumber)
    // 增:
    readonly Add = async (source: TModel) => await AxiosHelper.Add(this._action, source)
    // 改:
    readonly Edit = async (source: TModel) => await AxiosHelper.Put(this._action, source)
    // 删:
    readonly Delete = async (id: number) => await AxiosHelper.Delete(this._action, id)
}