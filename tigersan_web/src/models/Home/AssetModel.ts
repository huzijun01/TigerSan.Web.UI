import { IdModel, IdModelHelper, OnlineStates } from "@/0_tigersan_ui/tigerui"
import { AssetStates, ErrorTypes } from "../base/AssetStates"
import { axiosHelper } from "../base/AxiosHelper"

/** "资产基类"模型 */
class AssetBaseModel extends IdModel {
    department: bigint = 0n
    type: bigint = 0n
    assetId = ''
    state: AssetStates = AssetStates.NoRecord
    onlineState: OnlineStates = OnlineStates.Offline
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
    tagId? = ''
    rfid? = ''
    siteName? = ''
    battery?: number
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
    longitude?: number
    latitude?: number
    reportTime?: Date
}

class AssetHelper extends IdModelHelper<AssetModel> {
    constructor() {
        super('Asset')
    }

    /** 筛选“总数” */
    readonly GetCount = async (param: {
        company?: bigint,
        department?: bigint,
        type?: bigint,
        state?: number,
        onlineState?: OnlineStates,
        errorType?: ErrorTypes,
        assetId?: string,
    }) => await axiosHelper.GetCount(this._action, {
        filter: {
            parent: {
                id: param.department,
                parent: {
                    id: param.company,
                },
            },
            filters: [
                { propName: 'Type', value: param.type },
                { propName: 'State', value: param.state },
                { propName: 'OnlineState', value: param.onlineState },
                { propName: 'ErrorType', value: param.errorType },
                { propName: 'AssetId', value: param.assetId === '' ? undefined : param.assetId },
            ],
        }
    })

    /** 筛选“数据”集合 */
    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?: number,
        company?: bigint,
        department?: bigint,
        type?: bigint,
        state?: number,
        onlineState?: OnlineStates,
        errorType?: ErrorTypes,
        assetId?: string,
    }) => await axiosHelper.GetList<AssetModel>(this._action, {
        strList: 'FullList',
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        filter: {
            parent: {
                id: param.department,
                parent: {
                    id: param.company,
                },
            },
            filters: [
                { propName: 'Type', value: param.type },
                { propName: 'State', value: param.state },
                { propName: 'OnlineState', value: param.onlineState },
                { propName: 'ErrorType', value: param.errorType },
                { propName: 'AssetId', value: param.assetId === '' ? undefined : param.assetId },
            ],
        }
    })

    /** 筛选“位置”集合 */
    readonly GetPositionList = async (param: {
        pageSize?: number,
        pageNumber?: number,
        company?: bigint,
        department?: bigint,
        type?: bigint,
        state?: number,
        onlineState?: OnlineStates,
        errorType?: ErrorTypes,
        assetId?: string,
    }) => await axiosHelper.GetList<AssetPosition>(this._action, {
        strList: 'PositionList',
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        filter: {
            parent: {
                id: param.department,
                parent: {
                    id: param.company,
                },
            },
            filters: [
                { propName: 'Type', value: param.type },
                { propName: 'State', value: param.state },
                { propName: 'OnlineState', value: param.onlineState },
                { propName: 'ErrorType', value: param.errorType },
                { propName: 'AssetId', value: param.assetId === '' ? undefined : param.assetId },
            ],
        }
    })

    /** 入库 */
    readonly Inbound = async (ids: number[] | bigint[]) =>
        await axiosHelper.Put(`${this._action}/Inbound`, ids)

    /** 出库 */
    readonly Outbound = async (site: bigint, ids: number[] | bigint[]) =>
        await axiosHelper.Put(`${this._action}/Outbound/${site.toString()}`, ids)
}

export const assetHelper = new AssetHelper()