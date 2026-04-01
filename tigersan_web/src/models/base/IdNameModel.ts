import { IdModel, IdModelHelper } from "./IdModel"
import { AxiosHelper } from "../../helpers/AxiosHelper"
import { BigintHelper, SelectModel } from "@/0_tigersan_ui/tigerui"

/** ID名称对 */
export class IdNameModel extends IdModel {
    name = ''
}

export class IdNameModelHelper<TModel extends IdNameModel> extends IdModelHelper<TModel> {
    /** 更新“ID名称对”集合 */
    _idNames?: IdNameModel[]

    constructor(action: string) {
        super(action)
    }

    // 查:
    /** 获取“ID名称对”集合 */
    readonly GetIdNames = async () => await AxiosHelper.SelectIdName(this._action)

    /** 获取“ID名称对” */
    readonly GetIdName = (id: bigint): IdNameModel | undefined => {
        if (!this._idNames) {
            console.warn('The _idNames is undefined!')
            return
        }
        return this._idNames.find((i => BigintHelper.IsEqualAndNotUndefined(i.id, id)))
    }

    /** 获取“公司” */
    readonly GetModel = async (id: bigint): Promise<TModel | undefined> => {
        const model = (await this.GetList()).find((i => BigintHelper.IsEqualAndNotUndefined(i.id, id)))

        if (!model) {
            console.warn('The model is undefined!')
        }

        return model
    }

    /** 获取“名称” */
    readonly GetName = async (id: bigint, isUpdate: boolean = false): Promise<string> => {
        if (isUpdate || !this._idNames) {
            this._idNames = await this.GetIdNames()
        }

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

    /** 获取“筛选框模型” */
    GetSelectModel(
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