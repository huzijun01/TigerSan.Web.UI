import { TreeHelper, type TreeNodeConfig } from "@/0_tigersan_ui/tigerui"
import { IdModel, IdModelHelper } from "./base/IdModel"

export type CompanyEvent = (model: CompanyMgtModel) => void

/** "组织机构"模型 */
export class CompanyMgtModel extends IdModel {
    name: string = ''
    addr: string = ''
    parent?: number
}

export class CompanyMgtHelper extends IdModelHelper<CompanyMgtModel> {
    constructor() {
        super('CompanyMgt')
    }

    /** “公司数组”转“树配置” */
    static Companies2Tree(companies: CompanyMgtModel[]): TreeNodeConfig<CompanyMgtModel>[] {
        return TreeHelper.Array2Tree<CompanyMgtModel>(
            companies,
            item => item.name,
            item => item.id ?? 0,
            item => item.parent)
    }

    /** 获取“公司” */
    static async GetCompany(id: number): Promise<CompanyMgtModel | undefined> {
        return (await companyMgtHelper.GetAllList()).find((i => i.id === id))
    }

    /** 获取“公司名称” */
    static async GetCompanyName(id: number): Promise<string> {
        const company = (await companyMgtHelper.GetAllList()).find((i => i.id === id))
        return company ? company.name : ''
    }
}

export const companyMgtHelper = new CompanyMgtHelper()