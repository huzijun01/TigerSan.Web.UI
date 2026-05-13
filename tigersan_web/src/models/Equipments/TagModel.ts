import { IdModel, OnlineStates, IdModelHelper } from "@/0_tigersan_ui/tigerui"
import { axiosHelper } from "../base/AxiosHelper"

/** "标签"模型 */
export class TagModel extends IdModel {
    batch: bigint = 0n
    type: bigint = 0n
    station?: bigint
    isEnable = false
    onlineState = OnlineStates.Offline
    tagId = ''
    brandId? = ''
    battery?: number
    signal?: number
    temperature?: number
    longitude?: number
    latitude?: number
    comment?: string
    reportTime?: Date
    // 附加:
    company?: bigint
    companyName?: string
    site?: bigint
    siteName?: string
}

class TagHelper extends IdModelHelper<TagModel> {
    constructor() {
        super('Tag')
    }

    /** 筛选“总数” */
    readonly GetCount = async (param: {
        company?: bigint,
        batch?: bigint,
        type?: bigint,
        station?: bigint,
        isEnable?: boolean,
        state?: OnlineStates,
        tagId?: string,
    }) => await axiosHelper.GetCount(this._action, {
        filter: {
            parent: {
                id: param.batch,
                parent: {
                    id: param.company,
                },
            },
            filters: [
                { propName: 'Type', value: param.type },
                { propName: 'Station', value: param.station },
                { propName: 'IsEnable', value: param.isEnable },
                { propName: 'OnlineState', value: param.state },
                { propName: 'TagId', value: param.tagId === '' ? undefined : param.tagId },
            ],
        }
    })

    /** 筛选“数据”集合 */
    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?: number,
        company?: bigint,
        batch?: bigint,
        type?: bigint,
        station?: bigint,
        isEnable?: boolean,
        state?: OnlineStates,
        tagId?: string,
    }) => await axiosHelper.GetList<TagModel>(this._action, {
        strList: 'FullList',
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        filter: {
            parent: {
                id: param.batch,
                parent: {
                    id: param.company,
                },
            },
            filters: [
                { propName: 'Type', value: param.type },
                { propName: 'Station', value: param.station },
                { propName: 'IsEnable', value: param.isEnable },
                { propName: 'OnlineState', value: param.state },
                { propName: 'TagId', value: param.tagId === '' ? undefined : param.tagId },
            ],
        }
    })
}

export const tagHelper = new TagHelper()