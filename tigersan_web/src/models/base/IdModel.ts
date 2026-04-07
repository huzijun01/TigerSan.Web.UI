import type { KeyValue } from "@/helpers"
import { AxiosHelper } from "../../helpers/AxiosHelper"

/** "组织机构"模型 */
export class IdModel {
    readonly id: bigint = 0n
}

export class IdModelHelper<TModel extends IdModel> {
    readonly _action: string

    constructor(action: string) {
        this._action = action
    }

    // 查:
    readonly GetCount = async (param: {}) =>
        await AxiosHelper.GetCount(this._action, {})

    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?:
        number, strList?:
        string, params?: KeyValue[]
    }) => await AxiosHelper.GetList<TModel>(this._action, {
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        strList: param.strList,
        params: param.params
    })

    // 增:
    readonly Add = async (source: TModel, isRange: boolean = false) =>
        await AxiosHelper.Add(this._action, source, isRange)

    // 改:
    readonly Edit = async (source: TModel) =>
        await AxiosHelper.Put(this._action, source)

    // 删:
    readonly Delete = async (id: number | bigint) =>
        await AxiosHelper.Delete(this._action, id)
}