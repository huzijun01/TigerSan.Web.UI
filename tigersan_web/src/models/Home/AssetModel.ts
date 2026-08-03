import { ArrayHelper, OnlineStates, FilterDto } from "@/0_tigersan_ui/tigerui"
import { IdEntityBase, IdHelper, axiosHelper } from "@/helpers"
import { AssetStates, ErrorTypes, LocationModes } from "../base/AssetStates"

/** "资产"实体 */
export class AssetEntity extends IdEntityBase {
    assetId = ''
    department: bigint = 0n
    type: bigint = 0n
    tag?: bigint
    tagId?: string
    tagType?: bigint
    station?: bigint
    stationId?: string
    vehicle?: bigint
    transfer?: bigint
    name? = ''
    comment?: string
    // 计算:
    lastRecord?: bigint // 计算时才更新，建议使用GetLast获取最新记录
    state: AssetStates = AssetStates.NoRecord
    onlineState: OnlineStates = OnlineStates.Offline
    isAuto: boolean = true
    isFall?: boolean
    errorType?: ErrorTypes
    bindingTime?: Date
    calculationTime?: Date
    dailyMove?: number
    monthlyMove?: number
    totalMove?: number
    stayDuration?: number
    offlineDuration?: number
    travelDuration?: number
}

/** "资产"对象 */
export class AssetDto extends AssetEntity {
    company: bigint = 0n
    companyName = ''
    departmentName = ''
    typeName = ''
    stateName = ''
    rfid?: string
    plate?: string
    siteName?: string
    battery?: number
    fullAddr?: string
    transferCode?: string
}

/** 资产位置 */
export class AssetPosition extends IdEntityBase {
    assetId = ''
    lastRecord?: bigint
    longitude = 0
    latitude = 0
    reportTime?: Date
    locationMode?: LocationModes
}

/** “资产”过滤器 */
export class AssetFilter {
    company?: bigint
    companies?: bigint[]
    department?: bigint
    type?: bigint
    tagType?: bigint
    state?: AssetStates
    states?: Array<AssetStates | undefined>
    onlineState?: OnlineStates
    isAuto?: boolean
    isFall?: boolean
    errorType?: ErrorTypes
    name?: string
    assetId?: string
    tagId?: string
    rfid?: string

    static GetFilter(param: AssetFilter): FilterDto {
        return {
            parent: {
                id: param.department,
                parent: {
                    id: param.company,
                    ids: param.companies,
                },
            },
            filters: [
                { propName: 'Type', value: param.type },
                { propName: 'TagType', value: param.tagType },
                { propName: 'State', value: param.state, values: param.states },
                { propName: 'OnlineState', value: param.onlineState },
                { propName: 'IsAuto', value: param.isAuto },
                { propName: 'IsFall', value: param.isFall },
                { propName: 'ErrorType', value: param.errorType },
                { propName: 'Name', value: param.name === '' ? undefined : param.name, isFuzzy: true },
                { propName: 'AssetId', value: param.assetId === '' ? undefined : param.assetId },
                { propName: 'TagId', value: param.tagId === '' ? undefined : param.tagId },
            ],
        }
    }
}

export class AssetHelper extends IdHelper<AssetDto> {
    constructor() {
        super('Asset')
    }

    /** 根据“id”或“TagId”获取“单条数据” */
    readonly GetFull = async (id?: bigint, assetId?: string, rfid?: string) => await axiosHelper.Get<AssetDto>(`${this._action}/Full`, [
        { key: 'tagId', value: id ? id.toString() : undefined },
        { key: 'assetId', value: assetId },
        { key: 'rfid', value: rfid },
    ], false)

    /** 筛选“总数” */
    readonly GetCount = async (param: AssetFilter) => {
        if (!param.company && ArrayHelper.IsEmpty(param.companies)) return 0
        if (param.rfid) {
            const res = await this.GetFull(undefined, undefined, param.rfid)
            return res.data ? 1 : 0
        } else {
            return await axiosHelper.GetCount(this._action, {
                filter: AssetFilter.GetFilter(param)
            })
        }
    }

    /** 筛选“数据”集合 */
    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?: number,
    } & AssetFilter) => {
        if (!param.company && ArrayHelper.IsEmpty(param.companies)) return []
        if (param.rfid) {
            const res = await this.GetFull(undefined, undefined, param.rfid)
            const asset = res.data as AssetDto
            return asset ? [asset] : new Array<AssetDto>()
        } else {
            return await axiosHelper.GetList<AssetDto>(this._action, {
                strList: 'FullList',
                pageSize: param.pageSize,
                pageNumber: param.pageNumber,
                filter: AssetFilter.GetFilter(param)
            })
        }
    }

    /** 筛选“位置” */
    readonly GetPosition = async (asset: bigint) => {
        return await axiosHelper.Get<AssetPosition>(`${this._action}/Position/${asset}`)
    }

    /** 筛选“位置”集合 */
    readonly GetPositionList = async (param: {
        pageSize?: number,
        pageNumber?: number,
    } & AssetFilter): Promise<AssetPosition[]> => {
        if (!param.company && ArrayHelper.IsEmpty(param.companies)) return []
        if (param.rfid) {
            const res = await this.GetFull(undefined, undefined, param.rfid)
            const asset = res.data as AssetDto | undefined
            if (!asset) return []
            param.assetId = asset.assetId
        }
        return await axiosHelper.GetList<AssetPosition>(this._action, {
            strList: 'PositionList',
            pageSize: param.pageSize,
            pageNumber: param.pageNumber,
            filter: AssetFilter.GetFilter(param)
        })
    }

    /** 入库 */
    readonly Inbound = async (ids: number[] | bigint[]) =>
        await axiosHelper.Put(`${this._action}/Inbound`, undefined, ids)

    /** 出库 */
    readonly Outbound = async (site: bigint, ids: number[] | bigint[]) =>
        await axiosHelper.Put(`${this._action}/Outbound/${site.toString()}`, undefined, ids)
}

export const assetHelper = new AssetHelper()