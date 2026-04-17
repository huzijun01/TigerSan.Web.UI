import { IdNameModel, IdNameModelHelper, SelectModel, AxiosHelper } from "@/0_tigersan_ui/tigerui"

/** "组织机构"模型 */
export class SiteModel extends IdNameModel {
    company: bigint = 0n
    type: bigint = 0n
    addr = ''
    addrDetail = ''
    manager? = ''
    phone? = ''
    comment? = ''
}

class SiteHelper extends IdNameModelHelper<SiteModel> {
    constructor() {
        super('Site')
    }

    // 查:
    /** 获取“筛选框模型” */
    GetIdNameSelectModel(): SelectModel<IdNameModel> {
        return super.GetIdNameSelectModel('场地', 'Site')
    }

    /** 筛选“总数” */
    readonly GetCount = async (param: {
        company?: bigint,
        type?: bigint
    }) => await AxiosHelper.GetCount(this._action, {
        filter: {
            filters: [
                { propName: 'Company', value: param.company },
                { propName: 'type', value: param.type },
            ],
        }
    })

    /** 筛选“数据”集合 */
    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?: number
        company?: bigint,
        type?: bigint,
    }) => await AxiosHelper.GetList<SiteModel>(this._action, {
        pageSize: param.pageSize,
        pageNumber: param.pageNumber,
        filter: {
            filters: [
                { propName: 'Company', value: param.company },
                { propName: 'Type', value: param.type },
            ],
        }
    })

    /** 获取“ID名称对”集合 */
    readonly SelectIdNameByCompanyAsync = async (company?: bigint) => await this.GetIdNames({
        filter: {
            filters: [{ propName: 'Company', value: company }]
        }
    })

    /** 获取“所属公司”集合 */
    readonly GetBelongCompanyListAsync = async () => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongCompanyList`)

    /** 获取“所属类型”集合 */
    readonly GetBelongSiteTypeListAsync = async (company?: bigint) => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongSiteTypeList`,
        [{ key: 'company', value: company }])
}

export const siteHelper = new SiteHelper()