import { IdModel, IdModelHelper, OnlineStates } from "@/0_tigersan_ui/tigerui"
import { AssetStates } from "../base/AssetStates"
import { axiosHelper } from "../base/AxiosHelper"

/** "资产基类"模型 */
export class AssetRecordModel extends IdModel {
    asset: bigint = 0n
    tag: bigint = 0n
    state: AssetStates = AssetStates.NoRecord
    // Tag:
    onlineState: OnlineStates = OnlineStates.Offline
    site?: bigint = 0n
    targetSite?: bigint = 0n
    station?: bigint = 0n
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
    addr? = ''
    addrDetail? = ''
    targetSiteName?: string
    targetAddr? = ''
    targetAddrDetail? = ''
}

class AssetRecordHelper extends IdModelHelper<AssetRecordModel> {
    constructor() {
        super('AssetRecord')
    }

    /** 筛选“总数” */
    readonly GetCount = async (param: {
        asset?: bigint,
        company?: bigint,
        department?: bigint,
        state?: number,
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
        company?: bigint,
        department?: bigint,
        state?: number,
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
                { propName: 'State', value: param.state },
                { propName: 'Station', value: param.station },
                { propName: 'OnlineState', value: param.onlineState },
            ],
        }
    })

    // 增:
    readonly Add = async (source: AssetRecordModel, isRange: boolean = false) =>
        await axiosHelper.Add(`${this._action}/ByPackage`, source, isRange)
}

export const assetRecordHelper = new AssetRecordHelper()