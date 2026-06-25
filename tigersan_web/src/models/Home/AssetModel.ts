import { ArrayHelper, OnlineStates } from "@/0_tigersan_ui/tigerui"
import { AssetStates, ErrorTypes } from "../base/AssetStates"
import { IdModel, IdHelper, axiosHelper } from "@/helpers"

/** "资产基类"模型 */
class AssetBaseModel extends IdModel {
    department: bigint = 0n
    type: bigint = 0n
    assetId = ''
    state: AssetStates = AssetStates.NoRecord
    onlineState: OnlineStates = OnlineStates.Offline
    isFall?: boolean
    errorType?: ErrorTypes
    tag?: bigint
    lastRecord?: bigint
    name? = ''
    comment?: string
    bindingTime?: Date
    calculationTime?: Date
}

/** "资产"模型 */
export class AssetModel extends AssetBaseModel {
    // 附加:
    company: bigint = 0n
    companyName = ''
    departmentName = ''
    typeName = ''
    stateName = ''
    tagId?: string
    tagType?: bigint
    rfid?: string
    siteName?: string
    battery?: number
    fullAddr?: string
    // 计算:
    dailyMove?: number
    monthlyMove?: number
    totalMove?: number
    stayDuration?: number
    offlineDuration?: number
    travelDuration?: number
}

/** "资产位置"模型 */
export class AssetPosition extends IdModel {
    assetId = ''
    type?: bigint
    lastRecord?: bigint
    longitude: number = 0
    latitude: number = 0
    reportTime?: Date
}

export class AssetHelper extends IdHelper<AssetModel> {
    constructor() {
        super('Asset')
    }

    /** 根据“id”或“TagId”获取“单条数据” */
    readonly GetFull = async (id?: bigint, rfid?: string) => await axiosHelper.Get(`${this._action}/Full`, [
        { key: 'tagId', value: id ? id.toString() : undefined },
        { key: 'rfid', value: rfid }
    ], false)

    /** 筛选“总数” */
    readonly GetCount = async (param: {
        company?: bigint,
        companies?: bigint[],
        department?: bigint,
        type?: bigint,
        tagType?: bigint,
        state?: AssetStates,
        states?: Array<AssetStates | undefined>,
        onlineState?: OnlineStates,
        isFall?: boolean,
        errorType?: ErrorTypes,
        assetId?: string,
        rfid?: string,
    }) => {
        if (!param.company && ArrayHelper.IsEmpty(param.companies)) return 0
        if (param.rfid) {
            const res = await this.GetFull(undefined, param.rfid)
            return res.data ? 1 : 0
        } else {
            return await axiosHelper.GetCount(this._action, {
                filter: {
                    parent: {
                        id: param.department,
                        parent: {
                            id: param.company,
                            ids: param.companies,
                        },
                    },
                    filters: [
                        { propName: 'Type', value: param.type },
                        { propName: 'TagType', value: param.tagType },
                        { propName: 'State', value: param.state, values: param.states },
                        { propName: 'OnlineState', value: param.onlineState },
                        { propName: 'IsFall', value: param.isFall },
                        { propName: 'ErrorType', value: param.errorType },
                        { propName: 'AssetId', value: param.assetId === '' ? undefined : param.assetId },
                    ],
                }
            })
        }
    }

    /** 筛选“数据”集合 */
    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?: number,
        company?: bigint,
        companies?: bigint[],
        department?: bigint,
        type?: bigint,
        tagType?: bigint,
        state?: AssetStates,
        states?: Array<AssetStates | undefined>,
        onlineState?: OnlineStates,
        isFall?: boolean,
        errorType?: ErrorTypes,
        assetId?: string,
        rfid?: string,
    }) => {
        if (!param.company && ArrayHelper.IsEmpty(param.companies)) return []
        if (param.rfid) {
            const res = await this.GetFull(undefined, param.rfid)
            const asset = res.data as AssetModel
            return asset ? [asset] : new Array<AssetModel>()
        } else {
            return await axiosHelper.GetList<AssetModel>(this._action, {
                strList: 'FullList',
                pageSize: param.pageSize,
                pageNumber: param.pageNumber,
                filter: {
                    parent: {
                        id: param.department,
                        parent: {
                            id: param.company,
                            ids: param.companies,
                        },
                    },
                    filters: [
                        { propName: 'Type', value: param.type },
                        { propName: 'TagType', value: param.tagType },
                        { propName: 'State', value: param.state, values: param.states },
                        { propName: 'OnlineState', value: param.onlineState },
                        { propName: 'IsFall', value: param.isFall },
                        { propName: 'ErrorType', value: param.errorType },
                        { propName: 'AssetId', value: param.assetId === '' ? undefined : param.assetId },
                    ],
                }
            })
        }
    }

    /** 筛选“位置” */
    readonly GetPosition = async (asset: bigint) => {
        return await axiosHelper.Get<AssetPosition>(`${this._action}/Position/${asset}`)
    }

    /** 筛选“位置”集合 */
    readonly GetPositionList = async (param: {
        pageSize?: number,
        pageNumber?: number,
        company?: bigint,
        companies?: bigint[],
        department?: bigint,
        type?: bigint,
        state?: number,
        states?: Array<number | undefined>,
        onlineState?: OnlineStates,
        isFall?: boolean,
        errorType?: ErrorTypes,
        assetId?: string,
    }) => {
        if (!param.company && ArrayHelper.IsEmpty(param.companies)) return []
        return await axiosHelper.GetList<AssetPosition>(this._action, {
            strList: 'PositionList',
            pageSize: param.pageSize,
            pageNumber: param.pageNumber,
            filter: {
                parent: {
                    id: param.department,
                    parent: {
                        id: param.company,
                        ids: param.companies,
                    },
                },
                filters: [
                    { propName: 'Type', value: param.type },
                    { propName: 'State', value: param.state, values: param.states },
                    { propName: 'OnlineState', value: param.onlineState },
                    { propName: 'IsFall', value: param.isFall },
                    { propName: 'ErrorType', value: param.errorType },
                    { propName: 'AssetId', value: param.assetId === '' ? undefined : param.assetId },
                ],
            }
        })
    }

    /** 入库 */
    readonly Inbound = async (ids: number[] | bigint[]) =>
        await axiosHelper.Put(`${this._action}/Inbound`, ids)

    /** 出库 */
    readonly Outbound = async (site: bigint, ids: number[] | bigint[]) =>
        await axiosHelper.Put(`${this._action}/Outbound/${site.toString()}`, ids)
}

export const assetHelper = new AssetHelper()