import { IdName, ObjectHelper, OnlineStates, SelectModel, StringHelper, Texts } from "@/0_tigersan_ui/tigerui"
import { axiosHelper, IdNameHelper } from "@/helpers"

/** 基站类型 */
export enum StationTypes {
    /** 基础 */
    Base = 0,
    /** GPS */
    GPS = 1,
}

/** 基站类型 */
export class StationType {
    static GetString(obj: object, propName: string = 'stationType'): string {
        return StationType.GetName(ObjectHelper.DefaultTGetter(obj, propName, undefined))
    }

    static GetName(state?: StationTypes): string {
        if (state === undefined || state === null) return ''
        switch (state) {
            case StationTypes.Base:
                return Texts.Base.value
            case StationTypes.GPS:
                return 'GPS'
            default:
                return Texts.Unknown.value
        }
    }

    /** 获取“筛选框模型” */
    static GetSelectModel(): SelectModel<StationTypes> {
        const select = new SelectModel<StationTypes>()
        select.Width.value = 208
        select.Placeholder.value = Texts.StationType
        select.Items.push(...[0, 1])
        select._converter = this.GetName
        return select
    }
}

/** “基站”实体 */
export class BaseStationEntity extends IdName {
    site: bigint = 0n
    type: bigint = 0n
    asset?: bigint
    assetId?: string
    isEnable = true
    macAddr = ''
    stationType = StationTypes.Base
    onlineState = OnlineStates.Offline
    heartbeatInterval = 28800
    reportInterval = 28800
    monthOffline: bigint = 0n
    createTime: Date = new Date()
    reportTime?: Date
    image?: string
}

/** “基站”对象 */
export class BaseStationDto extends BaseStationEntity {
    typeName = ''
    siteName = ''
    company: bigint = 0n
    companyName = ''
    addr = ''
    addrDetail = ''
}

class BaseStationHelper extends IdNameHelper<BaseStationDto> {
    constructor() {
        super('BaseStation')
    }

    // 查:
    /** 获取“筛选框模型” */
    GetIdNameSelectModel(): SelectModel<IdName> {
        return super.GetIdNameSelectModel(Texts.BaseStation)
    }

    /** 筛选“总数” */
    readonly GetCount = async (
        param: {
            company?: bigint,
            site?: bigint,
            isEnable?: boolean,
            state?: OnlineStates,
            type?: bigint,
            macAddr?: string,
        }
    ) => await axiosHelper.GetCount(this._action, {
        filter: {
            filters: [
                { propName: 'IsEnable', value: param.isEnable },
                { propName: 'OnlineState', value: param.state },
                { propName: 'Type', value: param.type },
                { propName: 'MacAddr', value: StringHelper.IsNotEmpty(param.macAddr) ? param.macAddr : undefined },
            ],
            parent: {
                id: param.site,
                parent: {
                    id: param.company,
                }
            }
        },
    })

    /** 筛选“数据”集合 */
    readonly GetList = async (
        param: {
            pageSize?: number,
            pageNumber?: number,
            company?: bigint,
            site?: bigint,
            isEnable?: boolean,
            state?: OnlineStates,
            type?: bigint,
            macAddr?: string,
        }
    ) => await axiosHelper.GetList<BaseStationDto>(this._action, {
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        strList: 'FullList',
        filter: {
            filters: [
                { propName: 'IsEnable', value: param.isEnable },
                { propName: 'OnlineState', value: param.state },
                { propName: 'Type', value: param.type },
                { propName: 'MacAddr', value: StringHelper.IsNotEmpty(param.macAddr) ? param.macAddr : undefined },
            ],
            parent: {
                id: param.site,
                parent: {
                    id: param.company,
                }
            }
        },
    })

    /** 获取“所属公司”集合 */
    readonly GetBelongCompanyListAsync = async () => await axiosHelper.GetData<IdName[]>(`${this._action}/BelongCompanyList`)

    /** 获取“所属公司”集合 */
    readonly GetBelongSiteListAsync = async (company?: bigint) => {
        if (!company) return []
        return await axiosHelper.GetData<IdName[]>(`${this._action}/BelongSiteList`, [{ key: 'company', value: company }])
    }

    /** 获取“所属基站类型”集合 */
    readonly GetBelongStationTypeListAsync = async (company?: bigint, site?: bigint) => await axiosHelper.GetData<IdName[]>(`${this._action}/BelongStationTypeList`,
        [{ key: 'company', value: company }, { key: 'site', value: site }])
}

export const baseStationHelper = new BaseStationHelper()
