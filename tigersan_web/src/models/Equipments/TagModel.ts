import { AxiosHelper } from "@/helpers"
import { IdModel, IdModelHelper } from "../base/IdModel"
import { OnlineState } from "../base/OnlineState"

/** "组织机构"模型 */
export class TagModel extends IdModel {
    batch: bigint = 0n
    type: bigint = 0n
    station?: bigint
    isEnable = false
    onlineState = OnlineState.Offline
    tagId = ''
    brandId? = ''
    battery?: number
    temperature?: number
    signal?: number
    comment?: string
    lastReportTime?: Date
}

class TagMgtHelper extends IdModelHelper<TagModel> {
    constructor() {
        super('Tag')
    }

    /** 筛选“总数” */
    readonly GetCount = async (param: {
        batch?: bigint,
        type?: bigint,
        station?: bigint,
        isEnable?: boolean,
        state?: OnlineState,
        tagId?: string,
    }) => await AxiosHelper.GetCount(this._action,
        {
            filter: {
                filters: [
                    { propName: 'Batch', value: param.batch },
                    { propName: 'Type', value: param.type },
                    { propName: 'Station', value: param.station },
                    { propName: 'IsEnable', value: param.isEnable },
                    { propName: 'OnlineState', value: param.state },
                    { propName: 'TagId', value: param.tagId },
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
    }) => await AxiosHelper.GetList<TagModel>(this._action,
        {
            pageSize: param.pageSize,
            pageNumber: param.pageNumber,
            filter: {
                filters: [
                    { propName: 'Batch', value: param.batch },
                    { propName: 'Type', value: param.type },
                    { propName: 'Station', value: param.station },
                    { propName: 'IsEnable', value: param.isEnable },
                    { propName: 'OnlineState', value: param.state },
                    { propName: 'TagId', value: param.tagId },
                ],
            }
        })
}

export const tagMgtHelper = new TagMgtHelper()