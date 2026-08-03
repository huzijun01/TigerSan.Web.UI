import { OnlineStates } from "@/0_tigersan_ui/tigerui"
import { EqpTypes } from "../base/EqpTypes"
import { LocationModes } from "../base/AssetStates"
import { axiosHelper, IdEntityBase, IdHelper } from "@/helpers"

/** “标签”实体 */
export class TagEntity extends IdEntityBase {
    batch: bigint = 0n
    type: bigint = 0n
    station?: bigint
    isFall?: boolean
    isEnable = false
    eqpType = EqpTypes.Tag
    onlineState = OnlineStates.Offline
    locationMode?: LocationModes
    tagId = ''
    assetId? = ''
    rfid? = ''
    imei? = ''
    iccid? = ''
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
    stationName = ''
    company?: bigint
    companyName?: string
    site?: bigint
    siteName?: string
    address?: string
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
    readonly GetCount = async (param: {
        company?: bigint,
        batch?: bigint,
        type?: bigint,
        station?: bigint,
        eqpType?: EqpTypes,
        isEnable?: boolean,
        state?: OnlineStates,
        isFall?: boolean,
        tagId?: string,
        rfid?: string,
    }) => {
        if (param.rfid || param.tagId) {
            const res = await this.GetFull(param.tagId, param.rfid)
            return res.data ? 1 : 0
        } else {
            return await axiosHelper.GetCount(this._action, {
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
                        { propName: 'EqpType', value: param.eqpType },
                        { propName: 'IsEnable', value: param.isEnable },
                        { propName: 'OnlineState', value: param.state },
                        { propName: 'IsFall', value: param.isFall },
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
        batch?: bigint,
        type?: bigint,
        station?: bigint,
        eqpType?: EqpTypes,
        isEnable?: boolean,
        state?: OnlineStates,
        isFall?: boolean,
        tagId?: string,
        rfid?: string,
    }) => {
        if (param.rfid || param.tagId) {
            const res = await this.GetFull(param.tagId, param.rfid)
            const asset = res.data as TagDto
            return asset ? [asset] : new Array<TagDto>()
        } else {
            return await axiosHelper.GetList<TagDto>(this._action, {
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
                        { propName: 'EqpType', value: param.eqpType },
                        { propName: 'IsEnable', value: param.isEnable },
                        { propName: 'OnlineState', value: param.state },
                        { propName: 'IsFall', value: param.isFall },
                    ],
                }
            })
        }
    }
}

export const tagHelper = new TagHelper()