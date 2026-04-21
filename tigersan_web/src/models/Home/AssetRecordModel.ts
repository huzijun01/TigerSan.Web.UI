import { IdModel, IdModelHelper, AxiosHelper, OnlineStates } from "@/0_tigersan_ui/tigerui"
import { AssetStates, ErrorTypes } from "../base/AssetStates"

/** "资产基类"模型 */
export class AssetRecordModel extends IdModel {
    asset: bigint = 0n
    tag: bigint = 0n
    state: AssetStates = AssetStates.NoRecord
    // Tag:
    onlineState: OnlineStates = OnlineStates.Offline
    site?: bigint = 0n
    station?: bigint = 0n
    battery?: number
    signal?: number
    temperature?: number
    longitude?: number
    latitude?: number
    comment?: string
    reportTime?: Date
}

class AssetRecordHelper extends IdModelHelper<AssetRecordModel> {
    constructor() {
        super('AssetRecord')
    }

    /** 筛选“总数” */
    readonly GetCount = async (param: {
        asset?: bigint,
        state?: number,
        station?: bigint,
        onlineState?: OnlineStates,
    }) => await AxiosHelper.GetCount(this._action, {
        filter: {
            parent: {
                id: param.asset,
            },
            filters: [
                { propName: 'State', value: param.state },
                { propName: 'Station', value: param.station },
                { propName: 'OnlineState', value: param.onlineState },
            ],
        }
    })

    /** 筛选“数据”集合 */
    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?: number,
        asset?: bigint,
        state?: number,
        station?: bigint,
        onlineState?: OnlineStates,
    }) => await AxiosHelper.GetList<AssetRecordModel>(this._action, {
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        filter: {
            parent: {
                id: param.asset,
            },
            filters: [
                { propName: 'State', value: param.state },
                { propName: 'Station', value: param.station },
                { propName: 'OnlineState', value: param.onlineState },
            ],
        }
    })

    // 增:
    readonly Add = async (source: AssetRecordModel, isRange: boolean = false) =>
        await AxiosHelper.Add(`${this._action}/ByPackage`, source, isRange)
}

export const assetRecordHelper = new AssetRecordHelper()