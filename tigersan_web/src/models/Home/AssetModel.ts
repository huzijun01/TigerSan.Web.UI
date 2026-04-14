import { IdModel, IdModelHelper, AxiosHelper } from "@/0_tigersan_ui/tigerui"
import { AssetStates } from "../base/AssetStates"

/** "资产基类"模型 */
class AssetBaseModel extends IdModel {
    department: bigint = 0n
    type: bigint = 0n
    state: AssetStates = AssetStates.Offline
    assetId = ''
    tag?: bigint
    name? = ''
    comment?: string
    bindingTime?: Date
}

/** "资产"模型 */
export class AssetModel extends AssetBaseModel {
    company: bigint = 0n
    companyName = ''
    departmentName = ''
    typeName = ''
    stateName = ''
    tagId? = ''
    dailyMove?: number
    monthlyMove?: number
    totalMove?: number
    stayDuration?: number
    unreportDuration?: number
    travelDuration?: number
}

class AssetHelper extends IdModelHelper<AssetModel> {
    constructor() {
        super('Asset')
    }

    /** 筛选“总数” */
    readonly GetCount = async (param: {
        company?: bigint,
        department?: bigint,
        type?: bigint,
        state?: bigint,
        assetId?: string,
    }) => await AxiosHelper.GetCount(this._action, {
        filter: {
            parent: {
                id: param.department,
                parent: {
                    id: param.company,
                },
            },
            filters: [
                { propName: 'Type', value: param.type },
                { propName: 'State', value: param.state },
                { propName: 'AssetId', value: param.assetId },
            ],
        }
    })

    /** 筛选“数据”集合 */
    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?: number,
        company?: bigint,
        department?: bigint,
        type?: bigint,
        state?: bigint,
        assetId?: string,
    }) => await AxiosHelper.GetList<AssetModel>(this._action, {
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        filter: {
            parent: {
                id: param.department,
                parent: {
                    id: param.company,
                },
            },
            filters: [
                { propName: 'Type', value: param.type },
                { propName: 'State', value: param.state },
                { propName: 'AssetId', value: param.assetId },
            ],
        }
    })
}

export const assetHelper = new AssetHelper()