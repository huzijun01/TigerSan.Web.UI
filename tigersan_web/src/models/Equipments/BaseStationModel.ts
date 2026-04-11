import { IdNameModel, OnlineState, IdNameModelHelper, SelectModel, AxiosHelper } from "@/0_tigersan_ui/tigerui"

/** “基站”模型 */
export class BaseStationModel extends IdNameModel {
    company: bigint = 0n
    site: bigint = 0n
    type: bigint = 0n
    isEnable = false
    macAddr = ''
    addr = ''
    onlineState = OnlineState.Offline
    heartbeatInterval = 0
    reportInterval = 0
    monthOffline: bigint = 0n
    createTime: Date = new Date()
    lastReportTime?: Date
}

class BaseStationMgtHelper extends IdNameModelHelper<BaseStationModel> {
    constructor() {
        super('BaseStation')
    }

    // 查:
    /** 获取“筛选框模型” */
    GetIdNameSelectModel(): SelectModel<IdNameModel> {
        return super.GetIdNameSelectModel('请选择基站', 'Please select a baseStation')
    }

    /** 筛选“总数” */
    readonly GetCount = async (
        param: {
            company?: bigint,
            site?: bigint,
            isEnable?: boolean,
            state?: OnlineState,
            type?: bigint,
            macAddr?: string,
        }
    ) => await AxiosHelper.GetCount(this._action, {
        filter: {
            filters: [
                { propName: 'IsEnable', value: param.isEnable },
                { propName: 'OnlineState', value: param.state },
                { propName: 'Type', value: param.type },
                { propName: 'MacAddr', value: param.macAddr },
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
            state?: OnlineState,
            type?: bigint,
            macAddr?: string,
        }
    ) => await AxiosHelper.GetList<BaseStationModel>(this._action, {
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        strList: 'FullList',
        filter: {
            filters: [
                { propName: 'IsEnable', value: param.isEnable },
                { propName: 'OnlineState', value: param.state },
                { propName: 'Type', value: param.type },
                { propName: 'MacAddr', value: param.macAddr },
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
    readonly GetBelongCompanyListAsync = async () => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongCompanyList`)

    /** 获取“所属公司”集合 */
    readonly GetBelongSiteListAsync = async (company?: bigint) => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongSiteList`,
        [{ key: 'company', value: company }])

    /** 获取“所属基站类型”集合 */
    readonly GetBelongStationTypeListAsync = async (company?: bigint, site?: bigint) => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongStationTypeList`,
        [{ key: 'company', value: company }, { key: 'site', value: site }])
}

export const baseStationMgtHelper = new BaseStationMgtHelper()
