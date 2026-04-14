import { IdModel, OnlineState, IdModelHelper, AxiosHelper } from "@/0_tigersan_ui/tigerui"

/** "资产"模型 */
export class AssetModel extends IdModel {
    department: bigint = 0n
    type: bigint = 0n
    state: bigint = 0n
    asset_id = ''
    tag?: bigint
    name? = ''
    comment?: string
    daily_move?: number
    monthly_move?: number
    total_move?: number
    stay_duration?: number
    unreport_duration?: number
    travel_duration?: number
    binding_time?: Date
}

class AssetHelper extends IdModelHelper<AssetModel> {
    constructor() {
        super('Asset')
    }

    /** 筛选“总数” */
    readonly GetCount = async (param: {
        batch?: bigint,
        type?: bigint,
        station?: bigint,
        isEnable?: boolean,
        state?: OnlineState,
        tagId?: string,
    }) => await AxiosHelper.GetCount(this._action, {
        filter: {
            filters: [
                { propName: 'Batch', value: param.batch },
                { propName: 'Type', value: param.type },
                { propName: 'Station', value: param.station },
                { propName: 'IsEnable', value: param.isEnable },
                { propName: 'OnlineState', value: param.state },
                { propName: 'AssetId', value: param.tagId },
            ],
        }
    })

    /** 筛选“数据”集合 */
    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?: number,
        batch?: bigint,
        type?: bigint,
        station?: bigint,
        isEnable?: boolean,
        state?: OnlineState,
        tagId?: string,
    }) => await AxiosHelper.GetList<AssetModel>(this._action, {
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        filter: {
            filters: [
                { propName: 'Batch', value: param.batch },
                { propName: 'Type', value: param.type },
                { propName: 'Station', value: param.station },
                { propName: 'IsEnable', value: param.isEnable },
                { propName: 'OnlineState', value: param.state },
                { propName: 'AssetId', value: param.tagId },
            ],
        }
    })
}

export const assetHelper = new AssetHelper()