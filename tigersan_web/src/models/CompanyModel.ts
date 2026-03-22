import { IdNameModel, IdNameModelHelper } from "./base/IdNameModel"
import { BigintHelper, SelectModel, TreeHelper, TreeNodeConfig } from "@/0_tigersan_ui/tigerui"

export type CompanyEvent = (model: CompanyModel) => void

/** "组织机构"模型 */
export class CompanyModel extends IdNameModel {
    addr: string = ''
    parent?: bigint = undefined
}

export class CompanyMgtHelper extends IdNameModelHelper<CompanyModel> {
    constructor() {
        super('Company')
    }

    /** “公司数组”转“树配置” */
    static Companies2Tree(companies: CompanyModel[]): TreeNodeConfig<CompanyModel>[] {
        return TreeHelper.Array2Tree<CompanyModel>(
            companies,
            item => item.name,
            item => item.id ?? 0n,
            item => item.parent)
    }

    /** 获取“公司” */
    static async GetCompany(id: bigint): Promise<CompanyModel | undefined> {
        const company = (await companyMgtHelper.GetAllList()).find((i => BigintHelper.IsEqualAndNotUndefined(i.id, id)))
        if (!company) {
            console.warn('The company is undefined!')
        }
        return company
    }

    /** 获取“公司名称” */
    static async GetCompanyName(id: bigint): Promise<string> {
        const company = (await companyMgtHelper.GetAllList()).find((i => BigintHelper.IsEqualAndNotUndefined(i.id, id)))
        if (!company) {
            console.warn('The company is undefined!')
            return ''
        }
        return company.name
    }

    /** 获取“筛选框模型” */
    GetSelectModel(): SelectModel<IdNameModel> {
        const select = new SelectModel<IdNameModel>()
        select.Width.value = 208
        select.IsAllowSearch.value = true
        select.PlaceholderCN.value = '请选择公司名称'
        select.PlaceholderEN.value = 'Please select a company'
        select._getItemsAsync = async () => await companyMgtHelper.SelectIdName()
        select._converter = data => data.name
        return select
    }
}

export const companyMgtHelper = new CompanyMgtHelper()