import { KeyValueModel, BigintHelper, FilterModel, IdValueModel, SelectModel } from "@/0_tigersan_ui/tigerui"
import { axiosHelper } from "@/helpers/AxiosHelper"

/** "组织机构"模型 */
export class IdModel {
    id: bigint = 0n
}

export class IdHelper<TModel extends IdModel> {
    readonly _action: string
    /** 更新“ID值对”集合 */
    _idValues?: IdValueModel[]
    _strIdValueList = ''

    constructor(action: string) {
        this._action = action
    }

    // 查:
    readonly Get = async (id: bigint) =>
        await axiosHelper.Get<TModel>(`${this._action}/${id.toString()}`)

    readonly GetCount = async (param: {}) =>
        await axiosHelper.GetCount(this._action, {})

    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?: number,
        sort?: string,
        ascending?: boolean,
        strList?: string,
        params?: KeyValueModel[]
    }) => await axiosHelper.GetList<TModel>(this._action, {
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        sort: param.sort,
        ascending: param.ascending,
        strList: param.strList,
        params: param.params
    })

    // 增:
    readonly Add = async (source: TModel, isRange: boolean = false) =>
        await axiosHelper.Add(this._action, source, isRange)

    // 改:
    readonly Edit = async (source: TModel) =>
        await axiosHelper.Put(this._action, source)
    readonly EditRange = async (sources: TModel[]) =>
        await axiosHelper.Put(this._action, sources, undefined, true)

    // 删:
    readonly Delete = async (id: number | bigint) =>
        await axiosHelper.Delete(this._action, id)
    readonly DeleteRange = async (ids: number[] | bigint[]) =>
        await axiosHelper.DeleteRange(this._action, ids)

    // 筛选:
    /** 获取“ID值对”集合 */
    readonly GetIdValues = async (param?: {
        isDistinct?: boolean,
        strIdValueList?: string,
        params?: KeyValueModel[],
        filter?: FilterModel
    }) => {
        if (param && this._strIdValueList) {
            param.strIdValueList = this._strIdValueList
        }
        return await axiosHelper.SelectIdValue(this._action, param ?? { strIdValueList: this._strIdValueList })
    }

    /** 获取“ID值对” */
    readonly GetIdValue = (id: bigint): IdValueModel | undefined => {
        if (!this._idValues) {
            console.warn('The _idValues is undefined!')
            return
        }
        return this._idValues.find((i => BigintHelper.IsEqualAndNotUndefined(i.id, id)))
    }

    /** 获取“值” */
    readonly GetValue = async (id?: bigint, isUpdate: boolean = false): Promise<string> => {
        if (isUpdate || !this._idValues) {
            this._idValues = await this.GetIdValues()
        }

        const idValue = this._idValues.find((i => BigintHelper.IsEqualAndNotUndefined(i.id, id)))
        if (!idValue) {
            console.warn('The idValue is undefined!')
            return ''
        }

        return idValue.value
    }

    /** 更新“ID值对”集合 */
    readonly UpdateIdValues = async () => {
        this._idValues = await this.GetIdValues()
    }

    /** 获取“ID值对”筛选框模型 */
    GetIdValueSelectModel(
        placeholderCN: string,
        placeholderEN: string,
        width: number = 208): SelectModel<IdValueModel> {
        const select = new SelectModel<IdValueModel>()
        select.Width.value = width
        select.PlaceholderCN.value = placeholderCN
        select.PlaceholderEN.value = placeholderEN
        select._getItemsAsync = async () => await this.GetIdValues()
        select._converter = data => data.value
        return select
    }
}