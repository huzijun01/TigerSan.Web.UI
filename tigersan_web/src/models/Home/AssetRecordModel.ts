import { OnlineStates } from "@/0_tigersan_ui/tigerui"
import { AssetStates } from "../base/AssetStates"
import { IdModel, IdHelper, axiosHelper } from "@/helpers"

export class AssetLngLat {
    longitude: number = 0
    latitude: number = 0
    reportTime: Date = new Date()
    site?: bigint
    address?: string
}

/** "资产基类"模型 */
export class AssetRecordModel extends IdModel {
    asset: bigint = 0n
    tag: bigint = 0n
    state: AssetStates = AssetStates.NoRecord
    // Tag:
    onlineState: OnlineStates = OnlineStates.Offline
    site?: bigint
    targetSite?: bigint
    station?: bigint
    battery?: number
    signal?: number
    temperature?: number
    longitude?: number
    latitude?: number
    comment?: string
    reportTime?: Date
    // 附加:
    siteName?: string
    stationName?: string
    addr?: string
    addrDetail?: string
    address?: string
    targetSiteName?: string
    targetAddr?: string
    targetAddrDetail?: string
    fullAddr = ''
    fullTarget = ''
}

class AssetRecordHelper extends IdHelper<AssetRecordModel> {
    constructor() {
        super('AssetRecord')
    }

    /** 筛选“总数” */
    readonly GetCount = async (param: {
        asset?: bigint,
        company?: bigint,
        department?: bigint,
        state?: number,
        states?: Array<number | undefined>,
        station?: bigint,
        onlineState?: OnlineStates,
    }) => await axiosHelper.GetCount(this._action, {
        filter: {
            parent: {
                id: param.asset,
                parent: {
                    id: param.department,
                    parent: {
                        id: param.company,
                    }
                }
            },
            filters: [
                { propName: 'State', value: param.state, values: param.states },
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
        company?: bigint,
        department?: bigint,
        state?: number,
        states?: Array<number | undefined>,
        station?: bigint,
        onlineState?: OnlineStates,
    }) => await axiosHelper.GetList<AssetRecordModel>(this._action, {
        strList: 'FullList',
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        sort: 'ReportTime',
        ascending: false,
        filter: {
            parent: {
                id: param.asset,
                parent: {
                    id: param.department,
                    parent: {
                        id: param.company,
                    }
                }
            },
            filters: [
                { propName: 'State', value: param.state, values: param.states },
                { propName: 'Station', value: param.station },
                { propName: 'OnlineState', value: param.onlineState },
            ],
        }
    })

    /** 获取“路径” */
    readonly GetPath = async (param: {
        asset: bigint,
        start?: string,
        end?: string,
        company?: bigint,
        department?: bigint,
    }) => await axiosHelper.Post(`${this._action}/Path`, [
        { key: 'asset', value: param.asset },
        { key: 'start', value: param.start },
        { key: 'end', value: param.end },
    ], {
        filter: {
            parent: {
                parent: {
                    id: param.department,
                    parent: {
                        id: param.company,
                    }
                }
            },
        }
    })

    // 增:
    readonly Add = async (source: AssetRecordModel, isRange: boolean = false) =>
        await axiosHelper.Add(`${this._action}/ByPackage`, source, isRange)
}

export const assetRecordHelper = new AssetRecordHelper()