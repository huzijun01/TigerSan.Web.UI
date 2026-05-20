import { IdModelHelper } from "./IdModel"
import { FilterModel } from "./FilterModel"
import { IdNameModel } from "./SelectModel"
import { KeyValue } from "../helpers/ParamHelper"
import { SelectModel } from "./Inputs/SelectModel"
import { BigintHelper } from "../helpers/BigintHelper"
import { axiosHelper } from "@/models/base/AxiosHelper"

export class IdNameModelHelper<TModel extends IdNameModel> extends IdModelHelper<TModel> {
    /** 更新“ID名称对”集合 */
    _idNames?: IdNameModel[]

    constructor(action: string) {
        super(action)
    }

    // 查:
    /** 获取“ID名称对”集合 */
    readonly GetIdNames = async (param?: {
        isDistinct?: boolean,
        params?: KeyValue[],
        filter?: FilterModel
    }) => await axiosHelper.SelectIdName(this._action, param ?? {})

    /** 获取“ID名称对” */
    readonly GetIdName = (id: bigint): IdNameModel | undefined => {
        if (!this._idNames) {
            console.warn('The _idNames is undefined!')
            return
        }
        return this._idNames.find((i => BigintHelper.IsEqualAndNotUndefined(i.id, id)))
    }

    /** 获取“数据” */
    readonly GetModel = async (id: bigint): Promise<TModel | undefined> => {
        const model = (await this.GetList({})).find((i => BigintHelper.IsEqualAndNotUndefined(i.id, id)))

        if (!model) {
            console.warn('The model is undefined!')
        }

        return model
    }

    /** 获取“名称” */
    readonly GetNameAsync = async (id?: bigint, isUpdate: boolean = false): Promise<string> => {
        if (isUpdate || !this._idNames) {
            this._idNames = await this.GetIdNames()
        }

        return this.GetName(id)
    }

    /** 获取“名称” */
    readonly GetName = (id?: bigint): string => {
        if (!this._idNames) return ''

        const idName = this._idNames.find((i => BigintHelper.IsEqualAndNotUndefined(i.id, id)))
        if (!idName) {
            console.warn('The idName is undefined!')
            return ''
        }

        return idName.name
    }

    /** 更新“ID名称对”集合 */
    readonly UpdateIdNames = async () => {
        this._idNames = await this.GetIdNames()
    }

    /** 获取“ID名称对”筛选框模型 */
    GetIdNameSelectModel(
        placeholderCN: string,
        placeholderEN: string,
        width: number = 208): SelectModel<IdNameModel> {
        const select = new SelectModel<IdNameModel>()
        select.Width.value = width
        select.IsAllowSearch.value = true
        select.PlaceholderCN.value = placeholderCN
        select.PlaceholderEN.value = placeholderEN
        select._getItemsAsync = async () => await this.GetIdNames()
        select._converter = data => data.name
        return select
    }
}