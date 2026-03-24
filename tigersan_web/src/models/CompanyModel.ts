import { IdNameModel, IdNameModelHelper } from "./base/IdNameModel"
import { SelectModel, TreeHelper, TreeNodeConfig } from "@/0_tigersan_ui/tigerui"

export type CompanyEvent = (model: CompanyModel) => void

/** "公司"模型 */
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

    /** 获取“筛选框模型” */
    GetSelectModel(): SelectModel<IdNameModel> {
        return super.GetSelectModel('请选择公司', 'Please select a company')
    }
}

export const companyMgtHelper = new CompanyMgtHelper()