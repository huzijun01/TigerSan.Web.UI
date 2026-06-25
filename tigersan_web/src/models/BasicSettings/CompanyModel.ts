import { IdNameModel, SelectModel, TreeNodeConfig, TreeHelper } from "@/0_tigersan_ui/tigerui"
import { IdNameHelper } from "@/helpers"

/** "公司"模型 */
export class CompanyModel extends IdNameModel {
    addr: string = ''
    parent?: bigint = undefined
}

export class CompanyHelper extends IdNameHelper<CompanyModel> {
    constructor() {
        super('Company')
    }

    /** 获取“筛选框模型” */
    GetIdNameSelectModel(): SelectModel<IdNameModel> {
        const select = super.GetIdNameSelectModel('公司', 'Company')
        select.IsAllowSearch.value = true
        return select
    }

    /** “公司数组”转“树配置” */
    static Companies2Tree(companies: CompanyModel[]): TreeNodeConfig<CompanyModel>[] {
        return TreeHelper.Array2Tree<CompanyModel>(
            companies,
            item => item.name,
            item => item.id ?? 0n,
            item => item.parent)
    }
}

export const companyHelper = new CompanyHelper()