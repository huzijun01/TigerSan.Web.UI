import { IdModel, IdModelHelper, AxiosHelper, OnlineStates } from "@/0_tigersan_ui/tigerui"
import { AssetStates, ErrorTypes } from "../base/AssetStates"

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
    siteName? = ''
    battery? = ''
    // 计算:
    dailyMove?: number
    monthlyMove?: number
    totalMove?: number
    stayDuration?: number
    offlineDuration?: number
    travelDuration?: number
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
    }) => await AxiosHelper.GetCount(this._action, {
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
                { propName: 'AssetId', value: param.assetId },
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
    }) => await AxiosHelper.GetList<AssetModel>(this._action, {
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
                { propName: 'AssetId', value: param.assetId },
            ],
        }
    })
    
    /** 入库 */
    readonly Inbound = async (ids: number[] | bigint[]) =>
        await AxiosHelper.Put(`${this._action}/Inbound`, ids)
    
    /** 出库 */
    readonly Outbound = async (ids: number[] | bigint[]) =>
        await AxiosHelper.Put(`${this._action}/Outbound`, ids)
}

export const assetHelper = new AssetHelper()