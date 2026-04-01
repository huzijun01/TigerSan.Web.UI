import { SelectModel } from "@/0_tigersan_ui/tigerui"
import { AxiosHelper } from "@/helpers"
import { IdNameModel, IdNameModelHelper } from "./base/IdNameModel"

export type SiteEvent = (model: SiteModel) => void

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

class SiteMgtHelper extends IdNameModelHelper<SiteModel> {
    constructor() {
        super('Site')
    }

    // 查:
    /** 获取“筛选框模型” */
    GetSelectModel(): SelectModel<IdNameModel> {
        return super.GetSelectModel('请选择公司', 'Please select a site')
    }

    /** 筛选“总数” */
    readonly GetCountAsync = async (company?: bigint, type?: bigint) => await AxiosHelper.GetCount(this._action,
        [{ key: 'company', value: company }, { key: 'type', value: type }])

    /** 筛选“数据”集合 */
    readonly GetListAsync = async (company?: bigint, type?: bigint, pageSize?: number, pageNumber?: number) =>
        await AxiosHelper.GetList<SiteModel>(this._action, pageSize, pageNumber, undefined,
            [{ key: 'company', value: company }, { key: 'type', value: type }])

    /** 获取“所属公司”集合 */
    readonly GetBelongCompanyListAsync = async () => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongCompanyList`)

    /** 获取“所属类型”集合 */
    readonly GetBelongSiteTypeListAsync = async (company?: bigint) => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongSiteTypeList`,
        [{ key: 'company', value: company }])
}

export const siteMgtHelper = new SiteMgtHelper()