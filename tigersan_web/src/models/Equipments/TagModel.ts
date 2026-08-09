import { FilterDto, OnlineStates, StringHelper } from "@/0_tigersan_ui/tigerui"
import { EqpTypes } from "../base/EqpTypes"
import { LocationModes } from "../base/AssetStates"
import { axiosHelper, IdEntityBase, IdHelper } from "@/helpers"

/** “标签”实体 */
export class TagEntity extends IdEntityBase {
    batch: bigint = 0n
    type: bigint = 0n
    station?: bigint // 当前连接的基站（不作为绑定标志）
    stationId?: string // 基站绑定标志
    isFall?: boolean
    isEnable = true
    eqpType = EqpTypes.Tag
    onlineState = OnlineStates.Offline
    locationMode?: LocationModes
    tagId = ''
    assetId?: string
    rfid?: string
    imei?: string
    iccid?: string
    battery?: number
    signal?: number
    temperature?: number
    longitude?: number
    latitude?: number
    comment?: string
    reportTime?: Date
    image?: string
}

/** “标签”对象 */
export class TagDto extends TagEntity {
    batchId = ''
    typeName = ''
    company?: bigint
    companyName?: string
    site?: bigint
    siteName?: string
    address?: string
}

/** “标签”过滤器 */
export class TagFilter {
    company?: bigint
    batch?: bigint
    type?: bigint
    station?: bigint
    stationId?: string
    eqpType?: EqpTypes
    isEnable?: boolean
    state?: OnlineStates
    isFall?: boolean
    tagId?: string
    rfid?: string

    static GetFilter(param: TagFilter): FilterDto {
        return {
            parent: {
                id: param.batch,
                parent: {
                    id: param.company,
                },
            },
            filters: [
                { propName: 'TagId', value: StringHelper.IsNotEmpty(param.tagId) ? param.tagId : undefined, isFuzzy: true },
                { propName: 'Rfid', value: StringHelper.IsNotEmpty(param.rfid) ? param.rfid : undefined, isFuzzy: true },
                { propName: 'StationId', value: StringHelper.IsNotEmpty(param.stationId) ? param.stationId : undefined, isFuzzy: true },
                { propName: 'Type', value: param.type },
                { propName: 'Station', value: param.station },
                { propName: 'EqpType', value: param.eqpType },
                { propName: 'IsEnable', value: param.isEnable },
                { propName: 'OnlineState', value: param.state },
                { propName: 'IsFall', value: param.isFall },
            ],
        }
    }
}

class TagHelper extends IdHelper<TagDto> {
    constructor() {
        super('Tag')
    }

    /** 根据“TagId”或“RFID”获取“单条数据” */
    readonly GetFull = async (tagId?: string, rfid?: string) => await axiosHelper.Get<TagDto>(`${this._action}/Full`, [
        { key: 'tagId', value: tagId },
        { key: 'rfid', value: rfid }
    ], false)

    /** 筛选“总数” */
    readonly GetCount = async (param: TagFilter) => await axiosHelper.GetCount(this._action, {
        filter: TagFilter.GetFilter(param)
    })

    /** 筛选“数据”集合 */
    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?: number,
        sort?: string,
        ascending?: boolean,
    } & TagFilter) => await axiosHelper.GetList<TagDto>(this._action, {
        strList: 'FullList',
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        sort: param.sort,
        ascending: param.ascending,
        filter: TagFilter.GetFilter(param)
    })
}

export const tagHelper = new TagHelper()